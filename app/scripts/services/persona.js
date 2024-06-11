'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.persona
 * @description
 * # persona
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('persona', function(webservices) {

   this.obtenerGerentesCanal = function() {
      return webservices.get('Usuario/GerenteCanal');
   };

   this.obtenerGerentesArea = function() {
      return webservices.get('Usuario/GerenteArea');
   };

   this.obtenerAsesoresDeGerente = function(idGerente) {
      return webservices.get('Usuario/AsesoresPorGerente/' + idGerente);
   };

   this.obtenerPromotoresPorJefe = function(id) {
      return webservices.get('Usuario/PromotoresPorPersona/' + id);
   };

   this.obtenerOPVsPorAsesor = function(id) {
      return webservices.get('Usuario/OPVsPorAsesor/' + id);
   };

   this.obtenerVendedoresJRPorAsesor = function(id) {
      return webservices.get('Usuario/VendedoresJRPorAsesor/' + id);
   };

   this.obtenerKAMsDeGerente = function(idGerente) {
      return webservices.get('Usuario/KAMsPorGerente/' + idGerente);
   };

   this.asignarNombreCompleto = function(persona) {
      if (persona) {
         persona.NombreCompleto = [
            persona.Nombre,
            persona.Nombre2,
            persona.ApellidoPaterno,
            persona.ApellidoMaterno
         ].join(' ');
      }
      return persona;
   };

});
