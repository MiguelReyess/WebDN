'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:EnvioNotificacionesCtrl
 * @description
 * # EnvioNotificacionesCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('envio-notificaciones', {
      url: '/notificaciones/enviar',
      templateUrl: 'views/envio-notificaciones.html',
      controller: 'EnvioNotificacionesCtrl as vm',
      cache: false,
      loginRequired: false,
      resolve: {
         misPersonas: function(catalogoGeneral) {
            return catalogoGeneral.obtenerFuncionales();
         }
      },
      params: {},
      data: {
         titulo: 'Envío de Notificaciones'
      }
   });
})

.controller('EnvioNotificacionesCtrl', function(misPersonas, enviarNotificaciones,
   DNConfig, alertas) {

   var vm = this;

   misPersonas.forEach(function(persona) {
      persona.NombreCompleto = [
         persona.Nombre,
         persona.Nombre2,
         persona.ApellidoPaterno,
         persona.ApellidoMaterno
      ].join(' ');
   });
   this.personas = misPersonas;

   this.limpiar = function() {
      vm.destinatario = [];
      vm.titulo = null;
      vm.mensaje = null;
   };

   this.enviar = function() {
      if (!vm.destinatario || vm.destinatario.length === 0 || !vm.titulo || !vm.mensaje) {
         alertas.advertencia('', 'Favor de verificar los campos.');
         return;
      }

      var remitente = _.get(DNConfig.getUsuarioActivo(), 'Usuario');
      var titulo = vm.titulo;
      var mensaje = vm.mensaje;
      vm.destinatario.forEach(function(destinatario) {
         var destino = _.get(destinatario, 'Usuario');
         enviarNotificaciones.enviarNotificacion(remitente, destino, titulo, mensaje);
      });

      this.limpiar();
   };

});
