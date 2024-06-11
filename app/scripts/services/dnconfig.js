'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.DNConfig
 * @description
 * # DNConfig
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('DNConfig', ['$window', '$rootScope',
      function($window, $rootScope) {
      return {
         setUsuarioActivo: function(usuario) {
            $window.localStorage.setObject('usuarioActivo', usuario);
            $rootScope.$broadcast('onChangeUser');
         },
         getUsuarioActivo: function() {
            return $window.localStorage.getObject('usuarioActivo');
         },
         subsribeOnChangeUser: function(fn) {
            $rootScope.$on('onChangeUser', fn);
         }
      };
   }]);
