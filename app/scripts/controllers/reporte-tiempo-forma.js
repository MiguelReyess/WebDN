'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteTiempoFormaCtrl
 * @description
 * # ReporteTiempoFormaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('reporte-tiempo-forma', {
      url: '/reporte-tiempo-forma',
      views: {
         '@': {
            templateUrl: 'views/reporte-tiempo-forma.html',
            controller: 'ReporteTiempoFormaCtrl as vm',
         }
      },
      cache: false,
      loginRequired: true,
      resolve: {
      },
      params: {}
   });
})

.controller('ReporteTiempoFormaCtrl', function($scope, $state) {
   var vm = this;

   $scope.setTitle('Busqueda de Codigos');


   vm.buscar = function(){
      $state.go('reporte-tiempo-forma.codigos', {
         'fechainicio': vm.fechaInicio,
         'fechafin': vm.fechaFin
      });
   };

});
