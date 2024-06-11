'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.tareas
 * @description
 * # tareas
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('tarea', function($http, configuracion) {

      var url = configuracion.DireccionActiva;

      this.guardar = function(tarea) {
         return $http.post(url + 'PDV/Tarea', tarea)
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

   });
