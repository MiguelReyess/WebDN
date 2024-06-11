'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvAuditoriaEditarCtrl
 * @description
 * # PdvAuditoriaEditarCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('pdv-auditar.editar', {
      url: '/editar',
      views: {
         '@': {
            templateUrl: 'views/altapdv.html',
            controller: 'PdvAuditoriaEditarCtrl as vm',
         }
      },
      cache: false,
      loginRequired: true,
      resolve: {
         rPDV: function($stateParams, pdvPendiente) {
            return pdvPendiente.obtenerPendiente($stateParams.id);
         },
      },
      params: {}
   });
})

.controller('PdvAuditoriaEditarCtrl', function($scope, $state, rPDV, pdvPendiente,
   configuradorCapturaPdv, alertas) {

   var vm = this;

   $scope.setTitle('PDVs Pendientes - Editar');

   vm.pdv = rPDV;

   configuradorCapturaPdv.configurar(vm);


   vm.rechazar = function() {
      alertas.pregunta('Motivo de Rechazo',
            'Favor de entrar una descripción de la razón del rechazo.', true, {
               closeOnConfirm: false,
               showLoaderOnConfirm: true,
            })
         .then(function(motivo) {
            if (_.isEmpty(_.trim(motivo))) {
               vm.rechazar();
               swal.showInputError('Favor de entrar un motivo para poder rechazar.');
            } else {
               vm.pdv.MotivoRechazo = motivo;
               pdvPendiente.rechazar(vm.pdv.ID, vm.pdv)
                  .then(function() {
                     return alertas.exito('Rechazado',
                        'El PDV "' + vm.pdv.Nombre + '" ha sido rechazado.');
                  })
                  .then(function() {
                     $state.go('pdv-auditar', {
                        id: null
                     });
                  });
            }
         });
      return;
   };

   vm.guardarPDV = function() {
      pdvPendiente.validar(vm.pdv)
         .then(function() {
            return alertas.exito('Validado', 'El PDV ha sido validado.');
         })
         .then(function() {
            $state.go('^', {
               id: null
            });
         });
   };

   vm.eliminar = function() {
      alertas.advertencia('Advertencia',
            'Esta acción eliminará el PDV permanentemente.\n' +
            'Favor de confirmar la acción.', true, {
               closeOnConfirm: false
            })
         .then(function() {
            return pdvPendiente.eliminar(vm.pdv);
         })
         .then(function() {
            return alertas.exito('Eliminado', 'PDV eliminado.').catch(function() {});
         })
         .then(function() {
            return $state.go('pdv-auditar', {
               id: null
            });
         })
         .catch(function() {
            alertas.error('Error', 'El PDV no se ha eliminado.');
         });
   };

});
