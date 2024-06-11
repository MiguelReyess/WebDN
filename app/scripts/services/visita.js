'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.Visita
 * @description
 * # Visita
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('visita', function($http, configuracion) {

      this.obtenerRutasEmpleadosSupervision = function() {
         return $http.get(configuracion.DireccionActiva + 'Visita/Ruta/Supervisar')
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.obtenerVisitaPorID = function(idRuta) {
         return $http.get(configuracion.DireccionActiva + 'Visita/' + idRuta)
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

   });
