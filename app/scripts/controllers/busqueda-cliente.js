'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:BusquedaClienteCtrl
 * @description
 * # BusquedaClienteCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.controller('BusquedaClienteCtrl', function($cacheFactory,
    pdv, SweetAlert, catalogoGeneral) {

    var vm = this;

    function onChange() {
        var seleccionados = vm.grid.select();
        if (seleccionados.length) {
            var dataItem = vm.grid.dataItem(seleccionados.first());
            vm.onSeleccionado({
                pdv: dataItem
            });
        }
    }

    var toolbar = null;
    if (vm.exportar) {
        toolbar = [{
            template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
        }];
    }

    vm.gridOptions = {
        columns: [
            'ID',
            'Nombre', {
                field: 'Cadena.Nombre',
                title: 'Cadena'
            }, {
                field: 'AsesorComercial.Nombre',
                title: 'Asesor'
            }, {
                field: 'Estado.Nombre',
                title: 'Estado'
            }, {
                field: 'Municipio.Nombre',
                title: 'Ciudad'
            },

        ],
        resizable: true,
        selectable: vm.onSeleccionado ? 'row' : false,
        pageable: {
            pageSizes: [5, 10, 20, 100],
            pageSize: 10,
        },
        toolbar: toolbar,
        excel: {
            allPages: true,
        },
        excelExport: function(e) {
            e.workbook.fileName = vm.nombreArchivo;
            swal.close();
        },
        change: onChange,
        dataBound: function dataBound() {
            if (vm.grid) {
                vm.grid.columns.forEach(function(e, i) {
                    vm.grid.autoFitColumn(i);
                });
            }
        }
    };

    function obtenerFiltros() {
        return {
            id: vm.id,
            codigojde: vm.codigojde,
            zona: vm.zona && vm.zona.ID,
            nombre: vm.nombre,
            municipio: vm.municipio && vm.municipio.ID,
            estado: vm.estado && vm.estado.ID,
            grupocanal: vm.grupocanal && vm.grupocanal.ID,
            canal: vm.canal && vm.canal.ID,
            cliente: vm.tipocliente && vm.tipocliente.ID,
            segmentopdv: vm.segmentopdv && vm.segmentopdv.ID,
            cadena: vm.cadena && vm.cadena.ID,
            asesor: vm.asesor && vm.asesor.ID,
            clasificacioncliente: null,
        };
    }

    function siguientePaginaIDs(pagina, restantes, idsTotal) {
        return pdv.buscar(pagina, 5000, obtenerFiltros())
            .then(function(resp) {
                if (resp.TotalRegistros) {
                    restantes = resp.TotalRegistros;
                }
                var ids = _.map(resp.Reporte, 'ID');
                var nuevosRestantes = restantes - ids.length;
                idsTotal = idsTotal.concat(ids);
                if (nuevosRestantes > 0) {
                    return siguientePaginaIDs(pagina + 1, nuevosRestantes, idsTotal);
                } else {
                    return idsTotal;
                }
            });
    }

    vm.descargarIDs = function() {
        siguientePaginaIDs(1, null, [])
            .then(function(ids) {
                vm.onSeleccionado({
                    pdv: ids
                });
            });
    };

    /**
     * Ejecuta la búsqueda y llena el grid.
     */
    vm.buscar = function() {
        var total = null;
        var cache = $cacheFactory.get('modal-clientes') || $cacheFactory('modal-clientes', {
            capacity: 10
        });
        var dataSource = new kendo.data.DataSource({
            page: 1,
            pageSize: 10,
            serverPaging: true,
            transport: {
                read: function(options) {
                    var filtros = obtenerFiltros();

                    return pdv.buscar(options.data.page, options.data.pageSize,
                            filtros, cache)
                        .then(function(resp) {
                            options.success(resp);
                        })
                        .catch(function() {
                            options.error('No se ha podido realizar la búsqueda.');
                        });
                }
            },
            schema: {
                total: function(datos) {
                    total = datos.TotalRegistros || total;
                    return total;
                },
                data: 'Reporte',
                parse: function(datos) {
                    if (!datos) {
                        SweetAlert.warning('Sin Resultados');
                    }
                    return datos || {
                        Reporte: [],
                        TotalRegistros: 0,
                    };
                }
            }
        });
        vm.grid.setDataSource(dataSource);

        $('#exportarExcel').kendoButton({
            click: function() {
                var nombreDefault = 'Exportación de PDVs';
                SweetAlert.swal({
                    title: 'Exportar',
                    text: 'Escriba el nombre del archivo',
                    type: 'input',
                    showCancelButton: true,
                    inputValue: nombreDefault,
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false,
                }, function(nombre) {
                    if (nombre === false) {
                        return;
                    }
                    if (!nombre || nombre.trim() === '') {
                        nombre = nombreDefault;
                    }
                    nombre += '.xlsx';
                    vm.nombreArchivo = nombre;
                    vm.grid.saveAsExcel();
                });
            }
        });
    };

    //
    //
    //
    //  Carga de catálogos

    var ID_MEXICO = null;

    catalogoGeneral.obtenerPaises()
        .then(function(paises) {
            ID_MEXICO = paises[0].ID;
            catalogoGeneral.obtenerEstados(ID_MEXICO)
                .then(function(estados) {
                    vm.estados = estados;
                });
        });

    vm.cambiaEstado = function() {
        catalogoGeneral.obtenerMunicipios(ID_MEXICO, vm.estado.ID)
            .then(function(municipios) {
                vm.municipios = municipios;
            });
    };

    catalogoGeneral.obtenerPaises()
        .then(function(paises) {
            vm.paises = paises;
        });

    catalogoGeneral.obtenerCadenas()
        .then(function(cadenas) {
            vm.cadenas = cadenas;
        });

    catalogoGeneral.obtenerAsesoresComerciales()
        .then(function(asesores) {
            asesores.forEach(function(asesor) {
                asesor.Label = asesor.Nombre + ' ' + asesor.Nombre2 + ' ' + asesor.ApellidoPaterno + ' ' + asesor.ApellidoMaterno;
                asesor.LabelSort = asesor.Label.toUpperCase();
            });
            asesores.push({
                Label: 'Sin Asesor',
                ID: -1,
                LabelSort: '',
            });
            asesores = _.sortBy(asesores, 'LabelSort');
            vm.asesores = asesores;
        });

    catalogoGeneral.obtenerGruposCanales()
        .then(function(grupos) {
            vm.gruposcanales = grupos;
        });

    catalogoGeneral.obtenerZonas()
        .then(function(zonas) {
            vm.zonas = zonas;
        });

});