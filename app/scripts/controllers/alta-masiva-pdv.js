'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:AltaMasivaPdvCtrl
 * @description
 * # AltaMasivaPdvCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('alta-masiva-pdv', {
      url: '/alta/masiva/pdv',
      templateUrl: 'views/alta-masiva-pdv.html',
      controller: 'AltaMasivaPdvCtrl as vm',
      cache: false,
      loginRequired: true,
      resolve: {
         gerentes: function(persona, $q) {
            var canal = persona.obtenerGerentesCanal();
            var area = persona.obtenerGerentesArea();
            return $q.all([canal, area])
               .then(function(gerentes) {
                  return _.flatten(gerentes).map(persona.asignarNombreCompleto);
               });
         }
      },
      params: {}
   });
})

.controller('AltaMasivaPdvCtrl', function($scope, pdv, alertas, gerentes, persona) {

   var vm = this;

   $scope.setTitle('Alta Masiva de PDVs');

   vm.gerentes = gerentes;

   vm.cargarArchivo = function(archivo) {
      if (!archivo) {
         return;
      }
      pdv.altaMasiva(archivo)
         .then(function(datos) {
            datos = datos.data.Datos;
            if (datos.Errores) {
               alertas.error('Error', 'El archivo contiene errores.');
               vm.errores = datos.Errores;
            } else if (datos.PDVs) {
               vm.buenos = datos.PDVs;
            }
         })
         .catch(function(error) {
            console.log(error);
            alertas.error('Error', 'El archivo contiene errores.' + error.data.Mensaje);
         });
   };

   vm.guardar = function() {
      if (vm.buenos && vm.buenos.length > 0) {
         vm.buenos.forEach(function(p) {
            // p.Gerente = vm.gerente;
            // p.AsesorComercial = vm.asesor;
            // p.KAM = vm.kam;

            if (!p.Gerente || !p.Gerente.ID) {
               p.Gerente = vm.gerente;
            }
            if (!p.AsesorComercial || !p.AsesorComercial.ID) {
               p.AsesorComercial = vm.asesor;
            }
            if (!p.KAM || !p.KAM.ID) {
               p.KAM = vm.kam;
            }


         });
         pdv.guardarLista(vm.buenos)
            .then(function() {
               return alertas.exito('Éxito', 'PDVs guardados con éxito.');
            })
            .then(function() {
               vm.buenos = null;
               vm.gerente = null;
               vm.asesor = null;
               vm.kam = null;
            })
            .catch(function() {
               alertas.error('Error',
                  'Ha ocurrido un error al guardar la lista de PDVs.');
            });
      } else {
         alertas.error('Error', 'Debe capturar al menos 1 PDV para guardar.');
      }
   };

   $scope.$watch('vm.gerente', function() {
      vm.recargarAsesores();
      vm.recargarKAMs();
   });

   vm.recargarAsesores = function() {
      var idGerente = _.get(vm.gerente, 'ID');

      if (idGerente) {
         persona.obtenerAsesoresDeGerente(idGerente)
            .then(function(asesores) {
               vm.asesores = asesores.map(persona.asignarNombreCompleto);
            });
      } else {
         vm.asesores = null;
      }
   };

   vm.recargarKAMs = function() {
      var idGerente = _.get(vm.gerente, 'ID');

      if (idGerente) {
         persona.obtenerKAMsDeGerente(idGerente)
            .then(function(kams) {
               vm.kams = kams.map(persona.asignarNombreCompleto);
            });
      } else {
         vm.kams = null;
      }
   };

});
