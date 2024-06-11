'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ConfigCuestionarioListaCtrl
 * @description
 * # ConfigCuestionarioListaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('config-cuestionario-lista', {
      url: '/lista/cuestionario',
      templateUrl: 'views/config-cuestionario-lista.html',
      controller: 'ConfigCuestionarioListaCtrl as vm',
      cache: false,
      loginRequired: true,
      resolve: {
         rConfigs: function($stateParams, configuracionCuestionario) {
            return configuracionCuestionario.obtenerTodos();
         },
      },
      params: {}
   });
})

.controller('ConfigCuestionarioListaCtrl', function($scope, $state, rConfigs,
   configuracionCuestionario, alertas) {

   var vm = this;

   $scope.setTitle('Edición de Cuestionarios');

   vm.configs = rConfigs;

   vm.cancelar = function(config) {
      if (config && config.ID) {
         alertas.advertencia('Confirmar',
               'Favor de confirmar la cancelación del cuestionario: ' + config.Titulo,
               true)
            .then(function() {
               configuracionCuestionario.cancelar(config.ID)
                  .then(function() {
                     return alertas.exito('Éxito', 'Cuestionario cancelado.');
                  })
                  .then(function() {
                     $state.reload();
                  })
                  .catch(function() {
                     alertas.error('Error', 'No se ha podido cancelar.');
                  });
            });
      }
   };

});
