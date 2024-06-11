'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvCuestionarioCtrl
 * @description
 * # PdvCuestionarioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider
      .state('pdv-cuestionario', {
         url: '/pdv/cuestionario',
         templateUrl: 'views/pdv-cuestionario.html',
         controller: 'PdvCuestionarioCtrl as vm',
         cache: false,
         loginRequired: true,
         params: {}
      });
})

.controller('PdvCuestionarioCtrl', function($scope, configuracionCuestionario,
   catalogoGeneral, SweetAlert) {

   var vm = this;

   $scope.setTitle('Asignación de Cuestionarios a PDVs');

   vm.actuales = [];
   vm.pdvActual = null;

   configuracionCuestionario.obtenerTodos()
      .then(function(configs) {
         vm.configs = configs;
      });

   $scope.$watch('vm.pdvActual', function(nuevo) {
      if (nuevo) {
         vm.cargarPDV(nuevo);
      }
   });

   vm.cargarPDV = function(pdv) {
      vm.actuales = [];
      configuracionCuestionario.obtenerDePDV(pdv.ID)
         .then(function(actuales) {
            vm.actuales = actuales || [];
         });
   };

   vm.agregarCuestionario = function(config) {
      vm.actuales.push(config);
   };

   vm.quitarCuestionario = function(config) {
      vm.actuales = vm.actuales.filter(function(c) {
         return c.ID !== config.ID;
      });
   };

   vm.guardar = function() {
      configuracionCuestionario.guardarDePDV(vm.pdvActual.ID, vm.actuales)
         .then(function() {
            SweetAlert.success('Éxito', 'Los cuestionarios se han guardado.');
            vm.pdvActual = null;
            vm.actuales = [];
         })
         .catch(function(err) {
            console.error(err);
            SweetAlert.error('Error', 'No se han guardado los cuestionarios.');
         });
   };

});
