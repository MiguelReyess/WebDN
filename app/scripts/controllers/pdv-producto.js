'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvProductoCtrl
 * @description
 * # PdvProductoCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider
      .state('pdv-producto', {
         url: '/pdv/producto',
         templateUrl: 'views/pdv-producto.html',
         controller: 'PdvProductoCtrl as vm',
         cache: false,
         loginRequired: true,
         params: {}
      });
})

.controller('PdvProductoCtrl', function($scope, catalogoGeneral, SweetAlert,
   producto) {

   var vm = this;

   $scope.setTitle('Asignación de Productos a PDVs');

   vm.actuales = [];
   vm.pdvActual = null;

   producto.obtenerProductos()
      .then(function(productos) {
         vm.productos = productos;
      });

   $scope.$watch('vm.pdvActual', function(nuevo) {
      if (nuevo) {
         vm.cargarPDV(nuevo);
      }
   });

   vm.cargarPDV = function(pdv) {
      vm.actuales = [];
      producto.obtenerProductosDePDV(pdv.ID)
         .then(function(actuales) {
            vm.actuales = actuales || [];
         });
   };

   vm.agregarProducto = function(config) {
      vm.actuales.push(config);
   };

   vm.quitarProducto = function(config) {
      vm.actuales = vm.actuales.filter(function(c) {
         return c.ID !== config.ID;
      });
   };

   vm.guardar = function() {
      producto.guardarProductosDePDV(vm.pdvActual.ID, vm.actuales)
         .then(function() {
            SweetAlert.success('Éxito', 'Los productos se han guardado.');
            vm.pdvActual = null;
            vm.actuales = [];
         })
         .catch(function(err) {
            console.error(err);
            SweetAlert.error('Error', 'No se han guardado los productos.');
         });
   };

});
