'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.cliente
 * @description
 * # cliente
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('cliente', function($http, configuracion) {

   var url = configuracion.DireccionActiva;

   function llamar(servicio, pdv) {
      return $http.get(url + 'PDV/' + pdv + '/' + servicio)
         .then(function(resp) {
            return resp.data.Datos;
         })
         .catch(function(err) {
            throw err.data;
         });
   }

   this.obtenerVentas = function(pdv) {
      return llamar('Ventas', pdv);
   };

   this.obtenerTareas = function(pdv) {
      return llamar('Tareas', pdv);
   };

   this.obtenerActividades = function(pdv) {
      return llamar('Actividades', pdv);
   };

});
