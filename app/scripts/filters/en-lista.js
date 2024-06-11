'use strict';

/**
 * @ngdoc filter
 * @name ragasa-seguridad.filter:enLista
 * @function
 * @description
 * # enLista
 * Filter in the ragasa-seguridad.
 */
angular.module('dnwebApp')
  .filter('enLista', function() {
    return function(arreglo, filtro, param1, param2) {
      var invertido = false;
      var llave = false;

      if (angular.isString(param1)) {
        llave = _.property(param1);
        invertido = Boolean(param2);
        filtro = _.map(filtro, llave);
      } else {
        invertido = Boolean(param1);
      }

      if (angular.isArray(arreglo)) {
        var predicado;
        if (invertido) {
          predicado = _.negate(_.partial(_.includes, filtro));
        } else {
          predicado = _.partial(_.includes, filtro);
        }
        if (llave) {
          predicado = _.flow(llave, predicado);
        }
        return _.filter(arreglo, predicado);
      } else {
        return arreglo;
      }
    };
  });
