'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:menu
 * @description
 * # menu
 */
angular.module('dnwebApp')
   .directive('menu', ['opciones', 'interceptorPersonificar',
      function(opciones, interceptorPersonificar) {
         return {
            restrict: 'AE',
            templateUrl: 'views/menu.html',
            link: function(scope) {
               scope.expandido = {
                  ID: null
               };

               function obtenerOpciones() {
                  if (interceptorPersonificar.getUsuarioPersonificar()) {
                     opciones.obtenerOpcionesPersonificado()
                        .then(function(opciones) {
                           scope.opciones = opciones;
                        });
                  } else {
                     opciones.obtenerOpciones()
                        .then(function(opciones) {
                           scope.opciones = opciones;
                        });
                  }
               }
               scope.$on('reload-menu', obtenerOpciones);

               obtenerOpciones();
            }
         };
      }
   ]);
