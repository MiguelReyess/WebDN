'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:campoEstatico
 * @description
 * # campoEstatico
 */
angular.module('dnwebApp')
   .directive('campoEstatico', function() {
      return {
         restrict: 'E',
         templateUrl: 'views/campo-estatico.html',
         scope: {
            label: '=',
            valor: '=',
         }
      };
   });
