'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvPendienteCtrl
 * @description
 * # PdvPendienteCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('pdv-pendiente', {
      url: '/pdv/pendiente',
      templateUrl: 'views/pdv-pendiente.html',
      controller: 'PdvPendienteCtrl as vm',
      cache: false,
      loginRequired: true,
      resolve: {
         lista: function(pdvPendiente) {
            return pdvPendiente.obtenerPendientesPorAsesor();
         }
      },
      params: {}
   });
})

.controller('PdvPendienteCtrl', function($scope, lista, $state) {

   var vm = this;

   $scope.setTitle('PDVs Pendientes');

   vm.lista = lista;

   vm.editar = function(pdv) {
      $state.go('.editar', {
         id: pdv.ID
      });
   };

});
