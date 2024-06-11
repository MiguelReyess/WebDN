'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:busquedaCliente
 * @description
 * # busquedaCliente
 */
angular.module('dnwebApp')

.directive('busquedaCliente', function() {
   return {
      templateUrl: 'views/busqueda-cliente.html',
      controller: 'BusquedaClienteCtrl as vm',
      restrict: 'E',
      require: 'busquedaCliente',
      scope: {
         control: '=',
         onSeleccionado: '&?',
         exportar: '=',
         seleccionarTodos: '=',
      },
      bindToController: true,
      link: function postLink(scope, element, attrs, ctrl) {
         ctrl.control = function() {
            ctrl.buscar();
         };

         ctrl.seleccionarTodos = function() {
            ctrl.descargarIDs();
         };
      }
   };
});
