'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:capturaTexto
 * @description
 * # capturaTexto
 */
angular.module('dnwebApp')
   .directive('capturaTexto', function() {
      return {
         templateUrl: 'views/capturatexto.html',
         restrict: 'E',
         require: ['^form'],
         scope: {
            model: '=',
            label: '@',
            name: '@',
         },
         compile: function compile(element, attr) {
            var input = element.find('input');
            angular.forEach({
               'pattern': attr.pattern,
               'type': attr.type,
               'autofocus': attr.autofocus,
               'required': attr.required,
               'ng-value': attr.ngValue,
               'ng-model': attr.ngModel,
               'ng-disabled': attr.ngDisabled,
               'ng-change': attr.ngChange,
               'ng-required': attr.ngRequired,
               'ng-pattern': attr.ngPattern,
               'minlength': attr.minlength,
               'maxlength': attr.maxlength,
               'ng-minlength': attr.ngMinlength,
               'ng-maxlength': attr.ngMaxlength,
               'ng-trim': attr.ngTrim,
            }, function(value, name) {
               if (angular.isDefined(value)) {
                  input.attr(name, value);
               }
            });

            return function postLink(scope, element, attr, controllers) {
               var form = controllers[0];

               scope.form = form;
            };
         },
      };
   });
