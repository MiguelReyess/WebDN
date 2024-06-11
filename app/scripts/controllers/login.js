'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('LoginCtrl',
      function($scope, autenticacion, SweetAlert, DNConfig, $location, $rootScope,
         recibirNotificaciones) {
         $scope.setTitle('Acceso a Usuarios');

         $scope.login = function() {
            autenticacion.signIn($scope.login.Usuario, $scope.login.Password)
               .then(function(user) {
                  DNConfig.setUsuarioActivo(user);
                  $location.path($rootScope.returnToState || '/inicio');
                  recibirNotificaciones.suscribir(user.Usuario);
               }, function(err) {
                  SweetAlert.swal('Error', err, 'error');
               });
         };

         $scope.entrar = function(evento) {
            if (evento.which === 13) {
               $scope.login();
            }
         };

         $scope.siguiente = function(evento) {
            if (evento.which === 13) {
               $('#txtPassword').focus();
            }
         };

      }
   );
