'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.producto
 * @description
 * # producto
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('producto', function($http, webservices) {

   this.obtenerProductos = function() {
      return webservices.get('Producto');
   };

   this.obtenerProductosDePDV = function(idPDV) {
      return webservices.get('Producto/PDV/' + idPDV);
   };

   this.obtenerProductosMarcas = function() {
       return webservices.get('Producto/Marcas');
   }

   this.guardarProductosDePDV = function(idPDV, productos) {
      return webservices.put('Producto/PDV/' + idPDV, productos);
   };

   this.agregarProductos = function(idCadena, productos) {
      return webservices.put('Producto/Cadena/' + idCadena + '/Add', productos);
   };

   this.removerProductos = function(idCadena, productos) {
      return webservices.put('Producto/Cadena/' + idCadena + '/Delete', productos);
   };

});
