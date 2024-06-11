'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:selectorcliente
 * @description
 * # selectorcliente
 */
angular.module('dnwebApp')

.directive('selectorCliente', function($uibModal) {
   return {
      restrict: 'E',
      transclude: true,
      scope: {
         modelo: '=?',
         onSeleccionado: '&',
         seleccionMultiple: '=',
      },
      link: function postLink(scope, element, attrs, ctrl, transclude) {

         transclude(scope, function(clone) {
            element.append(clone);
         });

         function abrirModal() {
            var modalInstance = $uibModal.open({
               templateUrl: 'views/selectorcliente.html',
               controller: 'SelectorClienteModalCtrl as vm',
               size: 'lg',
               scope: scope
            });

            modalInstance.result
               .then(function(value) {
                  scope.modelo = value;
                  if (scope.onSeleccionado) {
                     scope.onSeleccionado({
                        pdv: value
                     });
                  }
               })
               .catch(function() {
                  // Modal cancelado
               });
         }

         scope.abrir = abrirModal;
      }
   };
})

//
//
//
// Controller
.controller('SelectorClienteModalCtrl', function($uibModalInstance) {

   var vm = this;

   vm.seleccionado = function(pdv) {
      $uibModalInstance.close(pdv);
   };

});
