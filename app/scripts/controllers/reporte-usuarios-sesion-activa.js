
'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteUsuariosSesionActivaCtrl
 * @description
 * # ReporteUsuariosSesionActivaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

  .controller('ReporteUsuariosSesionActivaCtrl', function($scope, $state, reporte, SweetAlert) {
    $scope.tituloPagina = 'Reporte de usuarios con sesión activa';
    var nombreArchivo;
    $scope.registros = false;
    $scope.reporte = [];
    var toolbar = [{
        template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
    }];

    $scope.obtenerReporte = function() {      

        reporte.usuariosSesionActiva()
        .then(function(rep){

            $scope.registros = true;
            $scope.$evalAsync(function() {
            var dataSource = new kendo.data.DataSource({
                data: rep.UsuariosDetalle,
                page: 1,
                pageSize: 10
            });
            var dataSourceRes = new kendo.data.DataSource({
                data: rep.UsuariosResumen,
                page: 1,
                pageSize: 10
            });
            $('#resumen').data('kendoGrid').setOptions({
                columns: [
                    { title: 'Días con sesión abierta', field: 'DiasSesionAbierta', headerAttributes: {"class": "table-header-cell", style: "text-align: center;"},attributes: {"class": "table-cell", style: "text-align: center;"}, },
                    { title: 'Asesor Comercial', field: 'Asesor_Comercial', headerAttributes: {"class": "table-header-cell", style: "text-align: right;"},attributes: {"class": "table-cell", style: "text-align: right;"},template:"#if(Asesor_Comercial!==null && Asesor_Comercial ==1){# #: Asesor_Comercial # usuario## #}else if(Asesor_Comercial>1){# #: Asesor_Comercial # usuarios## #}#"},
                    { title: 'Promotor', field: 'Promotor', headerAttributes: {"class": "table-header-cell", style: "text-align: right;"},attributes: {"class": "table-cell", style: "text-align: right;"}, template:"#if(Promotor!==null && Promotor ==1){# #: Promotor # usuario## #}else if(Promotor>1){# #: Promotor # usuarios## #}#"},
                    { title: 'Vendedor Jr', field: 'Vendedor_Jr', headerAttributes: {"class": "table-header-cell", style: "text-align: right;"},attributes: {"class": "table-cell", style: "text-align: right;"}, template:"#if(Vendedor_Jr!==null && Vendedor_Jr ==1){# #: Vendedor_Jr # usuario## #}else if(Vendedor_Jr>1){# #: Vendedor_Jr # usuarios## #}#" },
                    { title: 'OPV', field: 'OPV', headerAttributes: {"class": "table-header-cell", style: "text-align: right;"},attributes: {"class": "table-cell", style: "text-align: right;"} ,template:"#if(OPV!==null && OPV ==1){# #: OPV # usuario## #}else if(OPV>1){# #: OPV # usuarios## #}#"}
                    ],
                    scrollable: true,
                    resizable: false,
                    dataSource: dataSourceRes,
                    sortable: true,
                    pageable: {
                        pageSizes: [10, 20, 50, 100],
                        messages: {
                            itemsPerPage: "registros por página",
                            empty: "No hay registros",
                            display: "Mostrando {0}-{1} de {2} registros"
                        }
                    }
            });
            $('#detalle').data('kendoGrid').setOptions({
                columns: [
                    { title: 'Gerente', field: 'Gerente' },
                    { title: 'Asesor', field: 'Asesor' },
                    { title: 'Puesto', field: 'Puesto' },
                    { title: 'Usuario', field: 'Usuario' },
                    { title: 'Nombre Usuario', field: 'NombreUsuario', width: '150' },
                    { title: 'Fecha login', field: 'FechaLogin', template: "#= kendo.toString(kendo.parseDate(FechaLogin, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" },
                    { title: 'Fecha logout', field: 'FechaLogout', template: "#if(FechaLogout!==null ){# #: kendo.toString(kendo.parseDate(FechaLogout, 'yyyy-MM-dd'), 'MM/dd/yyyy')# #}#" },
                    { title: 'Horas con sesión abierta', field: 'HorasActivas' }
                    ],
                    scrollable: false,

                    resizable: false,
                    dataSource: dataSource,
                    groupable: {
                        messages:{
                            empty: 'Arrastrar columnas aquí para agrupar.'
                        }
                    },
                    toolbar: toolbar,
                    sortable: true,
                    excel: {
                        allPages: true
                    },
                    pageable: {
                        pageSizes: [10, 20, 50, 100],
                        messages: {
                            itemsPerPage: "registros por página",
                            empty: "No hay registros",
                            display: "Mostrando {0}-{1} de {2} registros"
                        }
                    },
                    excelExport: function(e) {
                        e.workbook.fileName = nombreArchivo;
                        e.workbook.sheets[0].title="Detalle";
                        swal.close();
                    },
                    dataBound: function(){
                      
                        $scope.$evalAsync(function() {
                            var grid = $('#detalle').data('kendoGrid');
                            grid.columns.forEach(function(e, i) {
                                grid.autoFitColumn(i);
                             
                            });
                        });
                    },
            });
            dataSource.fetch();
            $('#detalle')
            .find('#exportarExcel')
            .kendoButton({
                click: function() {
                    var nombreDefault = 'Reporte de usuarios con sesión activa';
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
                        nombreArchivo = nombre;
                        $('#detalle').data('kendoGrid').saveAsExcel();
                  });
                }
            });
        });
        });
    };
});