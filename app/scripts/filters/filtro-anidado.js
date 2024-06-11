'use strict';

/**
 * @ngdoc filter
 * @name ragasa-seguridad.filter:filtroAnidado
 * @function
 * @description
 * # filtroAnidado
 * Filter in the ragasa-seguridad.
 */
angular.module('dnwebApp')

.filter('filtroAnidado', function() {
   return function(arreglo, params) {

      if (!angular.isArray(arreglo)) {
         return arreglo;
      }

      function predicate(item) {
         var res = _.keys(params).map(function(param) {
            return _.includes(
               (_.get(item, param) || '').toString().toLowerCase(),
               params[param] || ''
            );
         });

         return _.every(res);
      }

      return _.filter(arreglo, predicate);
   };
});
