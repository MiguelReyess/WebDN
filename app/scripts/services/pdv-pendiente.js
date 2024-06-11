'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.pdvPendiente
 * @description
 * # pdvPendiente
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('pdvPendiente', function(webservices) {

   this.guardar = function(pdv) {
      var postData = pdv;
      return webservices.post('PDV/Pendiente', postData);
   };

   this.actualizarPendiente = function(pdv) {
      var postData = pdv;
      return webservices.put('PDV/Pendiente/' + pdv.ID, postData);
   };

   this.obtenerPendiente = function(id) {
      return webservices.get('PDV/Pendiente/' + id);
   };

   this.obtenerPendientesPorAsesor = function() {
      return webservices.get('PDV/Pendiente/Asesor');
   };

   this.obtenerPendientes = function() {
      return webservices.get('PDV/Pendiente');
   };

   this.rechazar = function(id, pdv) {
      return webservices.put('PDV/Pendiente/Rechazar/' + id, pdv);
   };

   this.validar = function(pdv) {
      return webservices.post('PDV/Pendiente/Validar/' + pdv.ID, pdv);
   };

   this.eliminar = function(pdv) {
      return webservices.delete('PDV/Pendiente/' + pdv.ID);
   };

});
