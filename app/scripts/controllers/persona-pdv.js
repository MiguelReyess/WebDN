'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PersonaPdvCtrl
 * @description
 * # PersonaPdvCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider
      .state('persona-pdv', {
         url: '/persona/pdv',
         templateUrl: 'views/persona-pdv.html',
         controller: 'PersonaPdvCtrl as vm',
         cache: false,
         loginRequired: true,
         params: {},
         resolve: {
            gerentes: function(persona, $q) {
               var canal = persona.obtenerGerentesCanal();
               var area = persona.obtenerGerentesArea();
               return $q.all([canal, area])
                  .then(function(gerentes) {
                     return _.flatten(gerentes);
                  });
            }
         }
      });
})

.controller('PersonaPdvCtrl', function($scope, catalogoGeneral, alertas, pdv,
   persona, gerentes, $q) {

   $scope.setTitle('Asignación de PDVs');

   var vm = this;

   gerentes.forEach(persona.asignarNombreCompleto);
   vm.gerentes = gerentes;

   vm.pdvActual = null;

   $scope.$watchGroup(['vm.asesor', 'vm.opvVendedor'], function() {
      vm.recargarPromotores();
   });

   $scope.$watch('vm.gerente', function() {
      vm.recargarAsesores();
   });

   $scope.$watch('vm.asesor', function() {
      vm.recargarOPVsVendedores();
   });

   vm.recargarAsesores = function() {
      var idGerente = _.get(vm.gerente, 'ID');

      if (idGerente) {
         persona.obtenerAsesoresDeGerente(idGerente)
            .then(function(asesores) {
               asesores.forEach(persona.asignarNombreCompleto);
               vm.asesores = asesores;
            });
      } else {
         vm.asesores = null;
      }
   };

   vm.recargarOPVsVendedores = function() {
      var idAsesor = _.get(vm.asesor, 'ID', 0);
      if (idAsesor) {

         var opvs = persona.obtenerOPVsPorAsesor(idAsesor);
         var vendedores = persona.obtenerVendedoresJRPorAsesor(idAsesor);
         return $q.all([opvs, vendedores])
            .then(function(personas) {
               personas = _.flatten(_.filter(personas));
               personas.forEach(persona.asignarNombreCompleto);
               vm.opvsVendedores = personas;
            });
      } else {
         vm.opvsVendedores = null;
      }
   };

   vm.recargarPromotores = function() {
      var id = _.get(vm.asesor, 'ID', 0);
      if (vm.opvVendedor) {
         id = vm.opvVendedor.ID;
      }
      if (id) {
         persona.obtenerPromotoresPorJefe(id)
            .then(function(promotores) {
               promotores.forEach(persona.asignarNombreCompleto);
               vm.promotores = promotores;
            });
      } else {
         vm.promotores = null;
      }
   };

   vm.pdvSeleccionado = function(seleccionado) {
      pdv.obtenerResponsables(seleccionado.ID)
         .then(function(valor) {
            vm.gerente = persona.asignarNombreCompleto(valor.Gerente);
            vm.asesor = persona.asignarNombreCompleto(valor.AsesorComercial);
            vm.opvVendedor = persona.asignarNombreCompleto(valor.OPVoVendedorJR);
            vm.promotor = persona.asignarNombreCompleto(valor.Promotor);
         });
   };

   vm.guardar = function() {

      var nPDV = _.clone(vm.pdvActual);

      nPDV.Gerente = vm.gerente;
      nPDV.AsesorComercial = vm.asesor;
      nPDV.OPVoVendedorJR = vm.opvVendedor;
      nPDV.Promotor = vm.promotor;
      nPDV.KAM = null;
      nPDV.Demostradora = null;

      pdv.guardarPersonas(nPDV)
         .then(function() {
            alertas.exito('Éxito', 'La asignación se ha guardado.');
         })
         .catch(function(err) {
            console.error(err);
            alertas.error('Error', 'No se ha guardado la asignación.');
         });
   };

});
