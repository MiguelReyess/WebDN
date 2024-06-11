'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:fechaMinima
 * @description
 * # fechaMinima
 */
angular.module('dnwebApp')
   .directive('fechaMinima', function($parse) {

      return {
         restrict: 'A',
         require: 'ngModel',
         link: function postLink(scope, element, attrs, ctrl) {
            var fechaMinima = $parse(attrs.fechaMinima);

            scope.$watch(attrs.fechaMinima, function() {
               ctrl.$validate();
            });

            ctrl.$validators.fechaMinima = function(modelValue) {
               if (ctrl.$isEmpty(modelValue)) {
                  return false;
               }

               var minimo = fechaMinima(scope);
               if (minimo && modelValue < minimo) {
                  return false;
               }

               return true;
            };
         }
      };

   });
