'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:conValidacion
 * @description
 * # conValidacion
 */
angular.module('dnwebApp')
   .directive('conValidacion', function($compile, $parse) {
      return {
         restrict: 'A',
         scope: false,
         link: function(scope, element, attrs) {
            var nuevoScope = scope.$new();
            nuevoScope.conValidacion = $parse(attrs.conValidacion).bind(null, nuevoScope);
            element.attr('ng-class', '{ \'has-success\': conValidacion().$valid, \'has-error\': conValidacion().$invalid }');
            element.removeAttr('con-validacion');
            $compile(element)(nuevoScope);
         }
      };
   });
