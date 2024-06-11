'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvPendienteEditarCtrl
 * @description
 * # PdvPendienteEditarCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('pdv-pendiente.editar', {
      url: '/:id',
      views: {
         '@': {
            templateUrl: 'views/altapdv.html',
            controller: 'PdvPendienteEditarCtrl as vm',
         }
      },
      cache: false,
      loginRequired: true,
      resolve: {
         rPDV: function($stateParams, pdvPendiente) {
            return pdvPendiente.obtenerPendiente($stateParams.id);
         },
      },
      params: {}
   });
})

.controller('PdvPendienteEditarCtrl', function($scope, $state, rPDV, alertas,
   pdvPendiente, configuradorCapturaPdv) {

   var vm = this;

   vm.pdv = rPDV;

   configuradorCapturaPdv.configurar(vm);

   $scope.setTitle('PDVs Pendientes - Editar');

   vm.guardarPDV = function() {
      pdvPendiente.actualizarPendiente(vm.pdv)
         .then(function() {
            return alertas.exito('Guardado', 'PDV guardado con éxito.');
         })
         .then(function() {
            $state.go('^', {}, {
               reload: true
            });
         })
         .catch(function() {
            alertas.error('Error', 'Error al guardar cambios.');
         });
   };

});
