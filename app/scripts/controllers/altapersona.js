'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:AltaPersonaCtrl
 * @description
 * # AltaPersonaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('AltaPersonaCtrl', function($scope, $log, catalogoGeneral, usuario,
      SweetAlert) {

      $scope.setTitle('Alta de Personas');

      $scope.usuario = {
         SistemasPermiso: []
      };

      catalogoGeneral.obtenerPuestos()
         .then(function(puestos) {
            $scope.Puestos = puestos;
         });

      catalogoGeneral.obtenerDominios()
         .then(function(dominios) {
            $scope.Dominios = dominios;
         });

      catalogoGeneral.obtenerPerfiles()
         .then(function(perfiles) {
            $scope.Perfiles = perfiles;
         });

      catalogoGeneral.obtenerSistemas()
         .then(function(sistemas) {
            $scope.Sistemas = sistemas;
         });

      usuario.obtenerPersonasACargo()
         .then(function(personas) {
            $scope.Personas = personas;
         });

      $scope.limpiarCampos = function() {
         $scope.usuario = {};
      };

      $scope.guardarUsuario = function() {
         usuario.guardarUsuario($scope.usuario)
            .then(function() {
               SweetAlert.success('Éxito', 'Guardado con éxito');
               $scope.limpiarCampos();
            })
            .catch(function(err) {
               $log.debug(err);
               SweetAlert.error('Error', err.Mensaje);
            });
      };

   });
