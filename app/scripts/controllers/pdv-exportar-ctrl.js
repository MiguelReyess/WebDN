'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:BusquedaClienteCtrl
 * @description
 * # BusquedaClienteCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
    .config(function($stateProvider) {
        $stateProvider.state('pdv-exportar', {
            url: '/pdv/exportar/',
            templateUrl: 'views/pdv-exportar.html',
            controller: 'PDVsExportarCtrl as vm',
            cache: false,
            loginRequired: true,
            params: {}
        });
    })
    .controller('PDVsExportarCtrl', function($cacheFactory,
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

        toolbar = [{
            template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
        }];


        vm.gridOptionsN = {
            columns: [

                {
                    field: 'CodigoSIC',
                    title: 'ID'
                },
                'Nombre',
                {
                    field: 'Cadena',
                    title: 'Cadena'
                }, {
                    field: 'CadenaCod',
                    title: 'Codigo Cadena'
                }, {
                    field: 'GerenteComercial',
                    title: 'Gerente'
                }, {
                    field: 'AsesorComercial',
                    title: 'Asesor'
                }, {
                    field: 'OPVVendedorJR',
                    title: 'OPV / Vendedor JR'                                                            
                }, {
                    field: 'Persona',
                    title: 'Promotor'
                }, {                    
                    field: 'Estado',
                    title: 'Estado'
                }, {
                    field: 'Municipio',
                    title: 'Ciudad'
                }, {
                    field: 'CodigoSIC',
                    title: 'Codigo SIC'
                }, {
                    field: 'CodigoJDE',
                    title: 'Codigo JDE73'
                }, {
                    field: 'CogigoJDE91',
                    title: 'Codigo JDE91'                    
                }, {
                    field: 'Zona',
                    title: 'Zona'
                }, {
                    field: 'GrupoCanal',
                    title: 'Grupo Canal'
                }, {
                    field: 'Canal',
                    title: 'Canal'
                }, {
                    field: 'CodigoCanal',
                    title: 'Codigo Canal'                    
                }, {
                    field: 'TipoPDV',
                    title: 'Tipo PDV'
                }, {
                    field: 'SegmentoPDV',
                    title: 'Segmento PDV'
                }, {
                    field: 'TipoCliente',
                    title: 'Tipo de cliente'
                }, {
                    field: 'Latitud',
                    title: 'Latitud'
                }, {
                    field: 'Longitud',
                    title: 'Longitud'
                }, {
                    field: 'UT',
                    title: 'UT'
                }, {
                    field: 'Activo',
                    title: 'Activo'
                }

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
                CodigoSIC: vm.CodigoSIC,
                CodigoJDE: vm.CodigoJDE,
                zona: vm.Zona && vm.Zona.ID,
                Nombre: vm.Nombre,
                Municipio: vm.Municipio && vm.Municipio.ID,
                Estado: vm.Estado && vm.Estado.ID,
                GrupoCanal: vm.GrupoCanal && vm.GrupoCanal.ID,
                Canal: vm.Canal && vm.Canal.ID,
                TipoCliente: vm.TipoCliente && vm.TipoCliente.ID,
                SegmentoPDV: vm.SegmentoPDV && vm.SegmentoPDV.ID,
                Cadena: vm.Cadena && vm.Cadena.ID,
                Asesor: vm.Asesor && vm.Asesor.ID,
                clasificacioncliente: null,
            };
        }

        function siguientePaginaIDs(pagina, restantes, idsTotal) {
            return pdv.buscarFiltros(pagina, 5000, obtenerFiltros())
                .then(function(resp) {
                    if (resp.TotalRegistros) {
                        restantes = resp.TotalRegistros;
                    }
                    var ids = _.map(resp.Reporte, 'CodigoSIC');
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
        vm.buscarFiltros = function() {
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

                        return pdv.buscarFiltros(options.data.page, options.data.pageSize,
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
            if (vm.Estado == null) {
                return false;
            }
            catalogoGeneral.obtenerMunicipios(ID_MEXICO, vm.Estado.ID)
                .then(function(municipios) {
                    var row = 1;
                    municipios.forEach(function(mun) {
                        mun.row = row;
                        row++;
                    });
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
                    asesor.Label = asesor.Nombre + ' ' + asesor.ApellidoPaterno;
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