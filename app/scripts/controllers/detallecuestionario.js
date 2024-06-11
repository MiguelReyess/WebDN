'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:DetallecuestionarioCtrl
 * @description
 * # DetallecuestionarioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('DetalleCuestionarioCtrl', function($scope, $state, cuestionario) {

      var nombreCuestionario = $state.params.nombre;
      var idCuestionario = $state.params.idHistorico;

      cuestionario['obtener' + nombreCuestionario](idCuestionario)
         .then(function(datos) {
            $scope.datosCuestionario = datos;
         });

      $scope.crearDataUrl = function(contenido) {
         if (contenido) {
            return 'data:image/png;base64,' + contenido;
         } else {
            return '';
         }
      };

   });
