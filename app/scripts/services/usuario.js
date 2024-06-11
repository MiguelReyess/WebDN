'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.usuario
 * @description
 * # usuario
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('usuario', function($http, configuracion) {

      return {
         obtenerPersonasACargo: function(soloDirectas) {
            var url = configuracion.DireccionActiva + 'Usuario/PersonasACargo';

            if (!soloDirectas) {
               url += '/All';
            }

            return $http.get(url)
               .then(function(resp) {
                  return resp.data.Datos;
               }, function(err) {
                  throw err.data;
               });

         },
         guardarUsuario: function(usuario) {
            return $http.post(configuracion.DireccionActiva + 'Usuario', usuario)
               .then(function(resp) {
                  return resp.data.Datos;
               })
               .catch(function(err) {
                  throw err.data;
               });
         },
         obtenerUsuario: function(idUsuario) {
            return $http.get(configuracion.DireccionActiva + 'Usuario/' + idUsuario)
               .then(function(resp) {
                  return resp.data.Datos;
               });
         },
         // obtenerPersonasPorSucursal: function() {
         //    var idSucursal = $DHConfig.getSucursalActiva().ID;
         //    var url = configuracion.DireccionActiva + 'Usuario/Personas/Sucursal/' + idSucursal;
         //
         //    return $http.get(url)
         //       .then(function(resp) {
         //          return resp.data.Datos;
         //       }, function(err) {
         //          throw err.data;
         //       });
         // },
         // obtenerSesionesDia: function() {
         //    var url = configuracion.DireccionActiva + 'Sesion';
         //
         //    return $http.get(url)
         //       .then(function(resp) {
         //          return resp.data.Datos;
         //       }, function(err) {
         //          throw err.data;
         //       });
         // },
         // cerrarSesionID: function(idSesion) {
         //    var url = configuracion.DireccionActiva + 'Sesion/CerrarSesion/' + idSesion;
         //
         //    return $http.put(url)
         //       .then(function(resp) {
         //          return resp.data.Datos;
         //       }, function(err) {
         //          throw err.data;
         //       });
         // }
      };

   });
