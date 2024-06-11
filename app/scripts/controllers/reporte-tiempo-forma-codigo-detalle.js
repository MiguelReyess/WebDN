'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteTiempoFormaCodigoDetalleCtrl
 * @description
 * # ReporteTiempoFormaCodigoDetalleCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('reporte-tiempo-forma.codigos.detalle', {
      url: '/{codigo}',
      views: {
         '@': {
            templateUrl: 'views/reporte-tiempo-forma-codigo-detalle.html',
            controller: 'ReporteTiempoFormaCodigoDetalleCtrl as vm',
         }
      },
      cache: false,
      loginRequired: true,
      resolve: {
      },
      params: {}
   });
})

.controller('ReporteTiempoFormaCodigoDetalleCtrl', function($scope, $state, reporte, SweetAlert,
   $window, excelServidor, alertas) {
   var vm = this;

   $scope.setTitle('Detalle de Codigo');

   var fechaInicio, fechaFin, codigo;

   vm.puedeExportar = false;

   function obtenerInformacion(){

      reporte.tiempoYFormaCodigoDetalle(fechaInicio, fechaFin, codigo).then(function(rep){
         vm.rep = rep;
         vm.puedeExportar = true;
         $scope.$evalAsync(function() {
            var dataSource = new kendo.data.DataSource({
               data: rep.DetalleReporte,
               page: 1,
               pageSize: 10
            });
            $('#grid').data('kendoGrid').setOptions({
               columns: [
                  { title: 'Estatus Tarea', field: 'EstatusTarea'},
                  { title: 'Fecha Hora Ejecucion', field: 'FechaHoraEjecucion' },
                  'Tarea',
                  'Tienda',
                  'Canal',
                  'Cadena',
                  { title: 'Gerente Canal', field: 'GerenteCanal' },
                  { title: 'Asesor Comercial', field: 'AsesorComercial' },
                  'Promotor',
                  { title: 'Zona NIELSEN', field: 'ZonaNIELSEN' },
                  { title: 'Zona ISCAM', field: 'ZonaISCAM' },
                  'Ciudad',
                  { title: 'Tipo PDV', field: 'TipoPDV' },
                  { title: 'Segmento PDV', field: 'SegmentoPDV' },
                  { title: 'Tiempo Tarea', field: 'TiempoTarea' }
               ],
               filterable: true,
               scrollable: true,
               resizable: true,
               dataSource: dataSource,
               sortable: true,
               pageable: {
                  pageSizes: [10, 20, 100],
               },
               dataBound: function(){
                  $scope.$evalAsync(function() {
                     var grid = $('#grid').data('kendoGrid');
                     grid.columns.forEach(function(e, i) {
                        grid.autoFitColumn(i);
                     });
                  });
               },
            });
            dataSource.fetch();
         });
      });
   }

   vm.volver = function(){
      $state.go('^', {
         fechainicio: fechaInicio,
         fechafin: fechaFin
      });
   };

   vm.exportar = function(){
      var nombreDefault = 'Reporte-Tiempo-Forma-' + codigo;
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

         reporte.tiempoYFormaCodigoDetalleXlsx(fechaInicio, fechaFin, codigo).then(function(guid){
            var url = excelServidor.generarURL(guid, nombre);
            $window.location.href = url;
            swal.close();
         })
         .catch(function(err){
            if (!angular.isString(err)) {
               err = '';
            }
            alertas.error('Error', 'Ha ocurrido un error al generar el archivo.' + err);
         })
         .finally(function(){
            swal.close();
         });
      });
   };

   if(!$state.params.fechainicio || !$state.params.fechafin){
      $state.go('reporte-tiempo-forma');
   } else{
      fechaInicio = $state.params.fechainicio;
      fechaFin = $state.params.fechafin;

      if(!$state.params.codigo) {
         $state.go('reporte-tiempo-forma.codigos', {
            fechainicio: fechaInicio,
            fechafin: fechaFin
         });
      }

      codigo = $state.params.codigo;

      vm.fechaInicio = fechaInicio;
      vm.fechaFin = fechaFin;
      vm.codigo = codigo;

      obtenerInformacion();
   }
});
