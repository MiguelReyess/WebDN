'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('MainCtrl',
      function($scope, $rootScope, $log, $timeout, $state, DNConfig, $location, opciones,
         SweetAlert, autenticacion, $uibModal, interceptorPersonificar) {
         $scope.menuHiden = true;
         $scope.isLogged = false;
         $scope.puedePersonificar = false;

         var loadUserData = function() {
            $scope.usuarioActivo = DNConfig.getUsuarioActivo();
         };

         function verificarPermisoPersonificar() {
            opciones.obtenerOpciones(false)
               .then(function(opciones) {
                  $scope.puedePersonificar = opciones.some(function(opcion) {
                     return opcion.ID === 6040;
                  });
               });
         }

         verificarPermisoPersonificar();

         DNConfig.subsribeOnChangeUser(function() {
            $scope.isLogged = autenticacion.isLogged();
            $scope.menuHiden = true;
            if (autenticacion.isLogged()) {
               $scope.menuHiden = false;
               loadUserData();
               opciones.obtenerOpciones(true)
                  .then(function() {
                     verificarPermisoPersonificar();
                  });
            }
         });

         loadUserData();

         $scope.cerrarSesion = function() {
            autenticacion.signOut().then(function() {
               $location.path('/login');
            }, function(err) {
               SweetAlert.swal('Error', err, 'error');
            });
         };

         $scope.ocultarMostrarMenu = function() {
            if (autenticacion.isLogged()) {
               $scope.menuHiden = !$scope.menuHiden;

               $scope.$broadcast('show-menu-before', !$scope.menuHiden);
               $timeout(function() {
                  $scope.$broadcast('show-menu', !$scope.menuHiden);
               }, 200);
            }
         };

         $scope.setTitle = function(titulo) {
            $scope.titulo = titulo;
         };

         $scope.personificar = function() {
            var modal = $uibModal.open({
               templateUrl: 'selectorPersonificar.html',
               size: 'sm',
               controller: ['$scope', '$uibModalInstance', 'personas',
                function($scope, $uibModalInstance, personas) {
                  $scope.personas = personas;
               }],
               resolve: {
                  personas: autenticacion.obtenerPersonas(),
               },
            });
            modal.result.then(function(seleccionado) {
               if (seleccionado) {
                  seleccionado.NombreCompleto = seleccionado.Nombre + ' ' + seleccionado.ApellidoPaterno;
               }
               interceptorPersonificar.setUsuarioPersonificar(seleccionado);
               $rootScope.$broadcast('reload-menu');
            });
         };

         $scope.terminarPersonificar = function() {
            interceptorPersonificar.setUsuarioPersonificar();
            $rootScope.$broadcast('reload-menu');
         };

         $scope.personificando = function() {
            return interceptorPersonificar.getUsuarioPersonificar();
         };

         autenticacion.checkAutoKeepAlive(function(isLogged) {
            $scope.isLogged = isLogged;
            if (!isLogged) {
               $state.go('login');
            }
         });

         $scope.$on('$stateChangeSuccess', function (evento, estado) {
            var titulo = _.get(estado, 'data.titulo');
            if (titulo) {
               $scope.setTitle(titulo);
            }
         });

         $scope.ocultarMostrarMenu();
      }
   );
