'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.webservices
 * @description
 * # webservices
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('webservices', function($http, configuracion) {

   var ESTATUS_OK = 1;
   // var ESTATUS_WARNING = 2;
   // var ESTATUS_ERROR = 0;

   var urlBase = configuracion.DireccionActiva;
   var roccV2Api = configuracion.RoccV2ApiActiva;

   function validarError(resp) {
      if (resp.status !== 204 && _.get(resp.data, 'Estatus') !== ESTATUS_OK) {
         var mensaje = resp.data.Mensaje || 'Ha ocurrido un error inesperado.';
         throw new Error(mensaje);
      } else {
         if (resp.data.Token) {
            resp.data.Datos.Token = resp.data.Token;
         }
         return resp.data.Datos;
      }
   }

   this.post = function(servicio, datos, config) {
      return $http.post(urlBase + servicio, datos, config)
         .then(validarError);
   };

   this.put = function(servicio, datos, config) {
      return $http.put(urlBase + servicio, datos, config)
         .then(validarError);
   };

   this.delete = function(servicio, parametros, config) {
      return $http.delete(urlBase + servicio,
            angular.extend({
               params: parametros,
            }, config))
         .then(validarError);
   };

   this.get = function(servicio, parametros, config) {
      return $http.get(urlBase + servicio,
            angular.extend({
               params: parametros,
            }, config))
         .then(validarError);
   };

   this.getCustom = function(servicio, parametros, config) {
      return $http.get(roccV2Api + servicio,
            angular.extend({
               params: parametros,
            }, config))
         .then();
   };

});
