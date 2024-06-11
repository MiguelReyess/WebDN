'use strict';

/**
 * @ngdoc filter
 * @name dnwebApp.filter:boolean
 * @function
 * @description
 * # boolean
 * Filter in the dnwebApp.
 */
angular.module('dnwebApp')
   .filter('boolean', function() {
      return function(input) {
         if (input === true) {
            return 'Sí';
         } else if (input === false) {
            return 'No';
         }
         return '';
      };
   });
