'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteTiempoFormaCodigoCtrl
 * @description
 * # ReporteTiempoFormaCodigoCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('reporte-tiempo-forma.codigos', {
      url: '/{fechainicio:date}-{fechafin:date}',
      views: {
         '@': {
            templateUrl: 'views/reporte-tiempo-forma-codigo.html',
            controller: 'ReporteTiempoFormaCodigoCtrl as vm',
         }
      },
      cache: false,
      loginRequired: true,
      resolve: {
      },
      params: {}
   });
})

.controller('ReporteTiempoFormaCodigoCtrl', function($scope, $state, reporte) {
   var vm = this;

   $scope.setTitle('Resultado de la busqueda de Codigos');

   var fechaInicio, fechaFin;

   function obtenerInformacion(){

      reporte.codigosTiempoYForma(fechaInicio, fechaFin).then(function(rep){
         $scope.$evalAsync(function() {
            var dataSource = new kendo.data.DataSource({
               data: rep,
               page: 1,
               pageSize: 10
            });
            $('#grid').data('kendoGrid').setOptions({
               columns: [
                  { title: 'Codigo', template: '<button class="btn btn-link" ng-click="vm.verCodigo(\'#= Codigo #\')">#= Codigo #</button>' },
                  'Titulo',
                  'Descripcion',
                  'Cuestionario',
                  { title: 'Fecha de Inicio', field: 'FechaInicio' },
                  { title: 'Fecha de Fin', field: 'FechaFin' },
                  { title: 'Fecha de Termino', field: 'FechaTermino' },
               ],
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

   if(!$state.params.fechainicio || !$state.params.fechafin){
      $state.go('reporte-tiempo-forma');
   }else{
      fechaInicio = $state.params.fechainicio;
      fechaFin = $state.params.fechafin;

      vm.fechaInicio = fechaInicio;
      vm.fechaFin = fechaFin;

      obtenerInformacion();

      vm.verCodigo = function(codigo){
         $state.go('reporte-tiempo-forma.codigos.detalle', {
            fechainicio: fechaInicio,
            fechafin: fechaFin,
            codigo: codigo
         });
      };
   }
});
