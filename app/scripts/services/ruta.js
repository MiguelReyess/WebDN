'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.ruta
 * @description
 * # ruta
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('ruta', function($q, $http, configuracion) {

      var url = configuracion.DireccionActiva;

      this.ASIGNADO = 1;
      this.CONTESTADO = 2;
      this.RECHAZADO = 3;

      this.guardar = function(ruta) {
         return $http.post(url + 'Ruta', ruta)
            .catch(function(resp) {
               throw resp.data.Mensaje;
            });
      };

      this.obtenerRuta = function(idPromotor) {
         return $http.get(url + 'Ruta/Persona/' + idPromotor)
            .catch(function(resp) {
               throw resp.data.Mensaje;
            });
      };

      this.obtenerRutaDeFecha = function(idPromotor, fecha) {
         return $http.get(url + 'Ruta/{id}/Visita/{fecha}'
               .replace('{id}', idPromotor)
               .replace('{fecha}', moment(fecha).format('YYYY-MM-DD')))
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.obtenerRutas = function() {
         return $http.get(url + 'Ruta/PersonasACargo')
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.obtenerRutaDia = function(idRuta) {
         return $http.get(url + 'Ruta/{id}/Dia'.replace('{id}', idRuta))
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.agregarClienteARuta = function(cliente, ruta) {
         var path = url + 'Ruta/{ruta}/Visita'
            .replace('{ruta}', ruta);
         return $http.put(path, cliente)
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.obtenerCuestionariosDeVisita = function(idVisita) {
         var path = url + 'Ruta/Visita/{idVisita}/Cuestionario'
            .replace('{idVisita}', idVisita);
         return $http.get(path)
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.ObtenerRutaPorID = function(idRuta){
         
         return $http.get(url + 'Ruta/' + idRuta)
         .then(function(resp){
            return resp;
         })
         .catch(function(err)
         {
            throw err.data.Mensaje;
         });
      };

      this.obtenerListadoRutas = function(estaActivo){

         return $http.get(url + 'Ruta/Listado/Activo/' + estaActivo)
         .then(function(resp){
            return resp.data.Datos;
         })
         .catch(function(err)
         {
            throw err.data.Mensaje;
         });
      }

   });
