'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:capturafecha
 * @description
 * # capturafecha
 */
angular.module('dnwebApp')
   .directive('capturaFecha', function() {
      return {
         templateUrl: 'views/capturafecha.html',
         restrict: 'E',
         require: ['^form'],
         scope: {
            model: '=',
            label: '@',
            name: '@',
            min: '=',
            max: '=',
         },
         compile: function compile(element, attr) {
            var input = element.find('input');
            angular.forEach({
               'required': attr.required,
               'ng-model': attr.ngModel,
               'ng-disabled': attr.ngDisabled,
               'ng-change': attr.ngChange,
               'ng-required': attr.ngRequired,
               'ng-model-options': attr.modelOptions,
            }, function(value, name) {
               if (angular.isDefined(value)) {
                  input.attr(name, value);
               }
            });

            return function postLink(scope, element, attr, controllers) {
               var form = controllers[0];
               var ngModel = input.controller('ngModel');

               ngModel.$validators.fechaMinima = function(modelValue) {
                  if (scope.min && (!modelValue || !scope.min || scope.min > modelValue)) {
                     return false;
                  }
                  return true;
               };
               ngModel.$validators.fechaMaxima = function(modelValue) {
                  if (scope.max && (!modelValue || !scope.max || scope.max < modelValue)) {
                     return false;
                  }
                  return true;
               };

               scope.$watchGroup(['min', 'max'], function() {
                  ngModel.$validate();
               });

               scope.form = form;
            };
         },
      };
   });
