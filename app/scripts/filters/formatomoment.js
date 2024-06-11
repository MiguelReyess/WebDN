'use strict';

/**
 * @ngdoc filter
 * @name dnwebApp.filter:formatoMoment
 * @function
 * @description
 * # formatoMoment
 * Filter in the dnwebApp.
 */
angular.module('dnwebApp')

.filter('formatoMoment', function(moment) {
   return function(input, formato) {
      var fecha = moment(input);
      if (input && fecha.isValid()) {
         return fecha.format(formato || 'DD-MMM-YYYY');
      } else {
         return input;
      }
   };
})

.filter('toDate', function() {

   return function toDate(input) {
      if (angular.isString(input)) {
         return moment(input).toDate();
      } else {
         return input;
      }
   };

});
