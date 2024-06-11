'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.configuradorCapturaPdv
 * @description
 * # configuradorCapturaPdv
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('configuradorCapturaPdv', function(catalogoGeneral) {

   this.configurar = function(vm) {

      catalogoGeneral.obtenerCadenas()
         .then(function(cadenas) {
            vm.Cadenas = cadenas;
         });

      catalogoGeneral.obtenerGruposCanales()
         .then(function(grupos) {
            vm.GruposCanales = grupos;

            // Encontrar el grupo, canal y tipo del PDV

            if (_.has(vm.pdv, 'SegmentoPDV.ID')) {
               var idSegmento = vm.pdv.SegmentoPDV.ID;
               vm.pdv.TipoPDV = _(grupos)
                  .map('Canales')
                  .flatten()
                  .map('TiposPDV')
                  .flatten()
                  .find(function(tipo) {
                     return _.some(tipo.SegmentosPDV, 'ID', idSegmento);
                  });

               var idTipo = vm.pdv.TipoPDV.ID;
               vm.pdv.Canal = _(grupos)
                  .map('Canales')
                  .flatten()
                  .find(function(canal) {
                     return _.some(canal.TiposPDV, 'ID', idTipo);
                  });

               var idCanal = vm.pdv.Canal.ID;
               vm.pdv.GrupoCanal = _(grupos)
                  .find(function(grupo) {
                     return _.some(grupo.Canales, 'ID', idCanal);
                  });
            }
         });

      catalogoGeneral.obtenerZonas()
         .then(function(zonas) {
            vm.Zonas = zonas;
         });

      catalogoGeneral.obtenerAsesoresComerciales()
         .then(function(asesores) {
            asesores.forEach(function(asesor) {
               asesor.Label = (asesor.ID || '') + ' ' + asesor.Nombre + ' ' + asesor.Nombre2 + ' ' +
                  asesor.ApellidoPaterno + ' ' + asesor.ApellidoMaterno;
            });
            vm.Asesores = asesores;
         });

      catalogoGeneral.obtenerPaises()
         .then(function(paises) {
            vm.Paises = paises;
         });

      vm.cambiaPais = function() {
         catalogoGeneral.obtenerEstados(vm.pdv.Pais.ID)
            .then(function(estados) {
               vm.Estados = estados;
            });
      };

      vm.cambiaEstado = function() {
         catalogoGeneral.obtenerMunicipios(vm.pdv.Pais.ID, vm.pdv.Estado.ID)
            .then(function(municipios) {
               vm.Municipios = municipios;
            })
            .catch(function () {
               vm.Municipios = null;
            });
      };

      vm.cambiaPaisContacto = function() {
         catalogoGeneral.obtenerEstados(vm.pdv.Contacto.Pais.ID)
            .then(function(estados) {
               vm.EstadosContacto = estados;
            });
      };

      if (_.has(vm.pdv, 'Pais.ID')) {
         vm.cambiaPais();
         if (_.has(vm.pdv, 'Estado.ID')) {
            vm.cambiaEstado();
         }
      }

   };

});
