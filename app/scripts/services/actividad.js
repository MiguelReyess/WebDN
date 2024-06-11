'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.actividad
 * @description
 * # actividad
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('actividad', function($http, configuracion) {

      var url = configuracion.DireccionActiva;

      this.guardar = function(tarea) {
         return $http.post(url + 'PDV/Actividad', tarea)
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

   });
