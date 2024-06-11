'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PersonaCuestionarioCtrl
 * @description
 * # PersonaCuestionarioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider
      .state('persona-cuestionario', {
         url: '/persona/cuestionario',
         templateUrl: 'views/persona-cuestionario.html',
         controller: 'PersonaCuestionarioCtrl as vm',
         cache: false,
         loginRequired: true,
         params: {}
      });
})

.controller('PersonaCuestionarioCtrl', function($scope, configuracionCuestionario,
   catalogoGeneral, SweetAlert) {

   var vm = this;

   $scope.setTitle('Asignación de Cuestionarios a Personas');

   vm.actuales = [];

   configuracionCuestionario.obtenerTodos()
      .then(function(configs) {
         vm.configs = configs;
      });


   catalogoGeneral.obtenerFuncionales()
      .then(function(promotores) {
         vm.promotores = promotores;
      });

   vm.cargarPersona = function(persona) {
      vm.actuales = [];
      vm.personaActual = persona;
      configuracionCuestionario.obtenerDePersona(persona.ID)
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
      configuracionCuestionario.guardarDePersona(vm.personaActual.ID, vm.actuales)
         .then(function() {
            SweetAlert.success('Éxito', 'Los cuestionarios se han guardado.');
            vm.personaActual = null;
            vm.actuales = [];
         })
         .catch(function(err) {
            console.error(err);
            SweetAlert.error('Error', 'No se han guardado los cuestionarios.');
         });
   };

});
