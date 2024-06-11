'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:CadenaProductoCtrl
 * @description
 * # CadenaProductoCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('cadena-producto', {
      url: '/cadena/producto',
      templateUrl: 'views/cadena-producto.html',
      controller: 'CadenaProductoCtrl as vm',
      cache: false,
      loginRequired: true,
      resolve: {
         rCadenas: function(catalogoGeneral) {
            return catalogoGeneral.obtenerCadenas();
         },
         rProductos: function(producto) {
            return producto.obtenerProductos();
         },
      },
      params: {}
   });
})

.controller('CadenaProductoCtrl', function($scope, rCadenas, rProductos,
   alertas, producto) {

   var vm = this;

   vm.cadenas = rCadenas;
   vm.productos = rProductos;

   $scope.setTitle('Productos por Cadena');

   function validar() {
      return Boolean(_.get(vm.cadena, 'ID') && _.get(vm.producto, 'ID'));
   }

   function limpiarCampos() {
      vm.producto = null;
      vm.cadena = null;
   }

   vm.agregarProducto = function() {
      if (validar()) {
         producto.agregarProductos(vm.cadena.ID, [vm.producto])
            .then(function(resp) {
               limpiarCampos();
               alertas.exito('Éxito', 'Se ha agregado el producto a ' + resp + ' PDVs.');
            })
            .catch(function() {
               alertas.error('Error', 'No se ha agregado el producto.');
            });
      }
   };

   vm.removerProducto = function() {
      if (validar()) {
         producto.removerProductos(vm.cadena.ID, [vm.producto])
            .then(function(resp) {
               limpiarCampos();
               alertas.exito('Éxito', 'Se ha removido el producto a ' + resp + ' PDVs.');
            })
            .catch(function() {
               alertas.error('Error', 'No se ha removido el producto.');
            });
      }
   };

});
