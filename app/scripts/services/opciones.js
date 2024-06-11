'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.opciones
 * @description
 * # opciones
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('opciones', function($window, $q, $http, $log, $rootScope,
   configuracion, autenticacion) {

   var obtenerOpcionesFromStorage = function() {
      return $window.localStorage.getObject('opciones');
   };

   var guardarOpcionesToStorage = function(opciones) {
      $window.localStorage.setObject('opciones', opciones);
   };

   var opciones = null;
   var opcionesPersonificado = null;

   this.obtenerOpcionesPersonificado = function() {
      return $http.get(configuracion.DireccionActiva + 'Usuario/Menu')
         .then(function(resp) {
            opciones = resp.data.Datos.Opciones;
            opcionesPersonificado = opciones;
            return opciones;
         })
         .catch(function(err) {
            throw err;
         });
   };

   this.obtenerOpciones = function(update) {
      return $q(function(resolve, reject) {
         var opciones = null;
         if (!update) {
            opciones = obtenerOpcionesFromStorage();
         }

         if (opciones === null) {
            $http.get(configuracion.DireccionActiva + 'Usuario/Menu')
               .then(function(resp) {
                  guardarOpcionesToStorage(resp.data.Datos.Opciones);
                  $rootScope.$broadcast('reload-menu');
                  resolve(resp.data.Datos.Opciones);
               }, function(err) {
                  reject(err.data, err.status);
               });
         } else {
            resolve(opciones);
         }
      });
   };

   this.isInRole = function(nombreVista) {
      var opciones = obtenerOpcionesFromStorage();

      if (autenticacion.isPersonificar()) {
         opciones = opcionesPersonificado || [];
      }

      var validarNombreVista = function(opts) {
         var isRole = false;

         if (angular.isArray(opts)) {
            for (var i = 0; i < opts.length; i++) {
               if ((opts[i].Opciones || []).length) {
                  isRole = validarNombreVista(opts[i].Opciones);
                  if (isRole) {
                     break;
                  }
               } else if (nombreVista.indexOf(opts[i].Detalle.NombreEstado) === 0) {
                  isRole = true;
                  break;
               }
            }
         }

         return isRole;
      };

      return validarNombreVista(opciones);
   };
});
