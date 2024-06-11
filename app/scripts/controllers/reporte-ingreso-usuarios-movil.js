'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteIngresoUsuariosMovilCtrl
 * @description
 * # ReporteIngresoUsuariosMovilCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

    .controller('ReporteIngresoUsuariosMovilCtrl', function($scope, $state, reporte, SweetAlert) {
        $scope.tituloPagina = 'Reporte de ingresos de usuarios a sistema móvil';
        var nombreArchivo;
        $scope.filtros = {};

        var toolbar = [{
            template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
        }];
        $scope.obtenerReporte = function() {
            $scope.filtros.rango;
            if($scope.filtros.rango !== undefined){

                reporte.ingresoUsuariosSistemaMovil(
                    $scope.filtros.rango).then(function(rep){
                    $scope.$evalAsync(function() {
                    var dataSource = new kendo.data.DataSource({
                       data: rep,
                       page: 1,
                       pageSize: 10
                    });
                    $('#noingresomovil').data('kendoGrid').setOptions({
                       columns: [
                          { title: 'Gerente', field: 'Gerente'},
                          { title: 'Asesor', field: 'Asesor'},
                          { title: 'Puesto', field: 'Puesto'},
                          { title: 'Usuario', field: 'Usuario'},
                          { title: 'Nombre Usuario', field: 'NombreUsuario', width: '150'},
                          { title: 'Ultimo Ingreso', field: 'UltimoIngreso',  template: "#= kendo.toString(kendo.parseDate(UltimoIngreso, 'yyyy-MM-dd'), 'MM/dd/yyyy') #"}
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
                            swal.close();
                        },
                       dataBound: function(){
                            
                            $scope.$evalAsync(function() {
                            var grid = $('#noingresomovil').data('kendoGrid');
                            grid.columns.forEach(function(e, i) {
                                
                                grid.autoFitColumn(i);
                                if($scope.filtros.rango == 3){
                                    grid.hideColumn('UltimoIngreso');
                                }
                             });
                          });
                       },
                    });
                    dataSource.fetch();
                    $('#noingresomovil')
                    .find('#exportarExcel')
                    .kendoButton({
                        click: function() {
                            var nombreDefault = 'Reporte de ingresos de usuarios a sistema móvil';
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
                            $('#noingresomovil').data('kendoGrid').saveAsExcel();
                           });
                        }
                     });
                 });
              });
            }
        };

    });
