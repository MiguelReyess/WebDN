'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:DetallevisitaCtrl
 * @description
 * # DetallevisitaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('DetalleVisitaCtrl', function($scope, $stateParams, $state,
      ruta, cuestionario, visita) {

      var idVisita = $stateParams.idVisita;

      ruta.obtenerCuestionariosDeVisita(idVisita)
         .then(function(cuestionarios) {
            $scope.obligatorios = cuestionarios.filter(function(c) {
               return c.ConfigCuestionario.TipoCuestionario.ID === 1;
            });
            $scope.opcionales = cuestionarios.filter(function(c) {
               return c.ConfigCuestionario.TipoCuestionario.ID !== 1;
            });
            ordenarPorEstado($scope.obligatorios);
            ordenarPorEstado($scope.opcionales);
         });

      visita.obtenerVisitaPorID(idVisita)
         .then(function(visita) {
            $scope.visita = visita;
         });

      function ordenarPorEstado(arr) {
         arr.forEach(function(cuestionario) {
            cuestionario.orden = (cuestionario.Estado.ID + 1) % 3;
         });
      }

      $scope.mostrarDetalle = function(cuest) {
         if (cuest.Estado.ID === 2) {
            var plantilla = cuestionario.plantillaParaIdCuestionario(cuest.ConfigCuestionario.Cuestionario.ID);
            $state.go('detalle-visita.cuestionario', {
               nombre: plantilla,
               idHistorico: cuest.ID
            }, {
               location: 'replace',
            });
            // var metodo = cuestionario.metodoParaIdCuestionario(cuest.ConfigCuestionario.Cuestionario.ID);
            // metodo(cuest.ID);
         }
      };

   });
