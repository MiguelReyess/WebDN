'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReportecuestionarioCtrl
 * @description
 * # ReportecuestionarioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('ReportecuestionarioCtrl', function($scope, $timeout, $uibModal,
      catalogoGeneral, reporte, imagenes, SweetAlert, $state, cuestionario,
      excelServidor, alertas, $window) {

      var esAuditoria = $state.is('auditar-cuestionarios');
      $scope.esAuditoria = esAuditoria;

      if (esAuditoria) {
         $scope.setTitle('Auditoría de Cuestionario');
      } else {
         $scope.setTitle('Reporte de Cuestionario');
      }

      $scope.cuestionarios = null;

      var inicioDeMes = moment();
      inicioDeMes.date(1);
      $scope.inicio = inicioDeMes.toDate();

      var nombreArchivo = null;

      catalogoGeneral.obtenerReportesDisponibles()
         .then(function(cuestionarios) {
            $scope.cuestionarios = cuestionarios;
         });
      catalogoGeneral.obtenerFuncionales()
         .then(function(usuarios) {
            $scope.usuarios = usuarios;
            $scope.usuario = usuarios[0];
         });
      catalogoGeneral.obtenerCadenas()
         .then(function(cadenas) {
            $scope.cadenas = cadenas;
         });

      $scope.buscarCliente = function(texto) {
         return catalogoGeneral.buscarCliente(texto, $scope.cadena && $scope.cadena.ID);
      };

      $scope.buscar = function() {
         borrarScopeDescarga();
         if (!$scope.cuestionario) {
            return;
         }
         $scope.cuestionarioMostrado = $scope.cuestionario;
         var reportesp = $scope.cuestionario.SPReporte;
         var codigo = $scope.codigo || null;
         var pdv = ($scope.pdv && $scope.pdv.ID) || null;
         var inicio = $scope.inicio || null;
         var fin = $scope.fin || null;
         var cadena = ($scope.cadena && $scope.cadena.ID) || null;
         var usuario = ($scope.usuario && $scope.usuario.ID) || null;

         var columnas = [];
         var total = 0;
         var itemsPorPagina = 10;

         // cargar data source
         $scope.$evalAsync(function() {
            var dataSource = new kendo.data.DataSource({
               transport: {
                  read: function(options) {
                     reporte.buscar(reportesp, options.data.page, options.data.pageSize, codigo,
                           pdv, inicio, fin, cadena, usuario)
                        .then(function(datos) {
                           // procesar nombres de columnas
                           options.success(datos);
                        })
                        .catch(function() {
                           options.error('No se ha podido ejecutar la consulta.');
                        });
                  },
               },
               serverPaging: true,
               serverSorting: true,
               pageSize: itemsPorPagina,
               page: 1,
               schema: {
                  total: function() {
                     return total;
                  },
                  data: 'Reporte',
                  parse: function(datos) {
                     if (datos.Reporte.length) {
                        datos.Reporte.forEach(function(dato) {
                           Object.keys(dato).forEach(function(llave) {
                              if (dato[llave] === null) {
                                 dato[llave] = '';
                              } else if (llave.toLowerCase().indexOf('date_') === 0) {
                                 dato[llave] = moment(dato[llave]).format(
                                    'DD-MMM-YYYY');
                              } else if (llave.toLowerCase().indexOf('datetime_') === 0) {
                                 dato[llave] = moment(dato[llave]).format(
                                    'DD-MMM-YYYY HH:mm');
                              }
                           });
                        });
                        columnas = Object.keys(datos.Reporte[0])
                           .filter(function(llave) {
                              return llave !== 'IDHistoricoCuestionario';
                           })
                           .map(function(llave) {
                              var template = '#: ' + llave + '#';
                             if (llave.indexOf('Ruta') === 0) {
                                template = `<img src="`+"#="+llave+`#" alt="Pic" width="100" height="100">`;
                             }
                              return {
                                 field: llave,
                                 title: llave.replace(/^img_|^date(time)?_|_/g, ' '),
                                 template: template
                              };
                           });
                        if (esAuditoria) {
                           columnas.push({
                              template: '<button class="btn btn-warning" ng-click="rechazar(#= IDHistoricoCuestionario #)">Rechazar</button>',
                           });
                        }
                     }

                     total = datos.TotalRegistros || total;

                     return datos;
                  },
               },
            });
            var toolbar = esAuditoria ? [] : [{
               template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Generar Archivo Excel</a>',
            }, {
               template: '<a ng-click="descargarExcel(excelURL)" ng-show="excelGuid" ng-href="{{excelURL}}" class="k-button k-button-icontext" id="descargarExcel" download="{{nombreDownload}}"><span class="k-icon k-i-seek-s"></span>Descargar Excel</a>',
            }, ];
            dataSource.fetch(function() {
               $('#grid').data('kendoGrid').setOptions({
                  columns: columnas,
                  scrollable: true,
                  resizable: true,
                  dataSource: dataSource,
                  toolbar: toolbar,
                  // sortable: true,
                  excel: {
                     allPages: true,
                  },
                  excelExport: function(e) {
                     e.workbook.fileName = nombreArchivo;
                     agregarVinculosImagenes(e);
                     swal.close();
                  },
                  pageable: {
                     pageSizes: [5, 10, 20, 100],
                     pageSize: itemsPorPagina,
                  },
                  dataBound: dataBound,
               });
               $('#grid')
                  .find('#exportarExcel')
                  .kendoButton({
                     click: botonExportar
                  });
            });
         });

      }; // Fin de buscar

      function botonExportar() {
         var nombreDefault = 'Reporte de ' + $scope.cuestionarioMostrado.Descripcion;
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

            var reportesp = $scope.cuestionario.SPReporte;
            var codigo = $scope.codigo || null;
            var pdv = ($scope.pdv && $scope.pdv.ID) || null;
            var inicio = $scope.inicio || null;
            var fin = $scope.fin || null;
            var cadena = ($scope.cadena && $scope.cadena.ID) || null;
            var usuario = ($scope.usuario && $scope.usuario.ID) || null;

            excelServidor.generar(reportesp, 1, Number.MAX_VALUE, codigo,
                  pdv, inicio, fin, cadena, usuario, nombreArchivo)
               .then(function(guid) {
                  $scope.excelGuid = guid;
                  $scope.nombreDownload = nombreArchivo;
                  $scope.excelURL = excelServidor.generarURL(guid, nombreArchivo);
                  swal.close();
               })
               .catch(function(err) {
                  if (!angular.isString(err)) {
                     err = '';
                  }
                  alertas.error('Error', 'Ha ocurrido un error al generar el archivo.' + err);
               })
               .finally(function() {
                  swal.close();
               });
         });
      }

      function borrarScopeDescarga() {
         $scope.excelGuid = null;
         $scope.nombreDownload = null;
         $scope.excelURL = null;
      }

      $scope.descargarExcel = function(link) {
         $window.location = link;
         borrarScopeDescarga();
      };

      /**
       * Agrega los URLs de imágen a la exportación de Excel
       * @param  {Event} e evento de Kendo
       */
      function agregarVinculosImagenes(e) {
         var workbook = e.workbook;
         var sheet = workbook.sheets[0];
         var filas = sheet.rows;
         var columnasGrid = e.sender.columns;
         var headers = filas[0];

         // Obtener indices donde hay columnas de imagen
         var indicesImagenes = headers.cells.map(function(elt, i) {
               return [elt, i];
            })
            .filter(function(elt) {
               return columnasGrid[elt[1]].field.indexOf('img_') === 0;
            })
            .map(function(elt) {
               return elt[1];
            });

         // Insertar, después de cada columna de imagen, una columna de URL
         indicesImagenes.reverse().forEach(function(indice) {
            // Agrega ancho de columna igual al de ID de imagen
            sheet.columns.splice(indice, 0, sheet.columns[indice]);
            sheet.rows.forEach(function(row, numFila) {
               var copiaCelda = angular.copy(row.cells[indice]);
               if (numFila === 0) {
                  // Es header
                  copiaCelda.value = 'URL ' + copiaCelda.value.trim();
               } else {
                  if (copiaCelda.value) {
                     copiaCelda.formula = '=HYPERLINK("' + imagenes.obtenerUrl(copiaCelda.value) + '")';
                     delete copiaCelda.value;
                  } else {
                     copiaCelda.value = '';
                  }
               }
               row.cells.splice(indice, 0, copiaCelda);
            });
         });
      }

      // Redimensiona las columnas para que no tenga wrapping
      function dataBound() {
         $scope.$evalAsync(function() {
            var grid = $('#grid').data('kendoGrid');
            grid.columns.forEach(function(e, i) {
               grid.autoFitColumn(i);
            });
         });
      }

      function rechazarCuestionario(idCuestionario) {
         cuestionario.rechazar(idCuestionario)
            .then(function() {
               SweetAlert.success('Éxito', 'Cuestionario rechazado.');
            })
            .catch(function() {
               SweetAlert.error('Error', 'No se pudo rechazar el cuestionario.');
            });
      }
      $scope.rechazar = rechazarCuestionario;

      $scope.abrirImagen = function(imagen, idCuestionario) {
         imagenes.obtenerArchivo(imagen)
            .then(function(datos) {
               var scope = $scope.$new();
               scope.imagen = datos;
               scope.idCuestionario = idCuestionario;
               scope.rechazar = rechazarCuestionario;
               $uibModal.open({
                  templateUrl: 'modal-imagen-reporte',
                  scope: scope,
               });
            });

      };

   });
