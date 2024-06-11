'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvAuditoriaCtrl
 * @description
 * # PdvAuditoriaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('pdv-auditar', {
      url: '/auditar/pdv/:id',
      templateUrl: function(params) {
         if (params.id) {
            return 'views/pdv-auditoria.html';
         } else {
            return 'views/pdv-pendiente.html';
         }
      },
      controller: 'PdvAuditoriaCtrl as vm',
      cache: false,
      loginRequired: true,
      resolve: {
         rPDV: function($stateParams, pdvPendiente) {
            if ($stateParams.id) {
               return pdvPendiente.obtenerPendiente($stateParams.id);
            } else {
               return null;
            }
         },
         rLista: function($stateParams, pdvPendiente) {
            if ($stateParams.id) {
               return null;
            } else {
               return pdvPendiente.obtenerPendientes();
            }
         }
      },
      params: {}
   });
})

.controller('PdvAuditoriaCtrl', function($scope, $state, rPDV, rLista,
   pdvPendiente, alertas, configuradorCapturaPdv) {

   var vm = this;

   vm.pdv = rPDV;
   vm.lista = rLista;

   $scope.setTitle('PDVs Pendientes');

   configuradorCapturaPdv.configurar(vm);

   vm.auditar = function(pdv) {
      $state.go('pdv-auditar', {
         id: pdv.ID
      });
   };

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

   vm.validar = function() {
      pdvPendiente.validar(vm.pdv)
         .then(function() {
            return alertas.exito('Validado', 'El PDV se ha validado.');
         })
         .then(function() {
            $state.go('pdv-auditar', {
               id: null
            });
         });
   };

   vm.editar = function() {
      $state.go('.editar', {
         id: vm.pdv.ID
      }, {
         location: 'replace'
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
            return alertas.exito('Eliminado', 'PDV eliminado.')
               .finally(function() {
                  $state.go('pdv-auditar', {
                     id: null
                  });
               });
         })
         .catch(function() {
            alertas.toastError('El PDV no se ha eliminado.');
         });
   };

});
