'use strict';

/**
 * @ngdoc service
 * @name ragasa-seguridad.alertas
 * @description
 * # alertas
 * Service in the ragasa-seguridad.
 */
angular.module('dnwebApp')

.service('alertas', function($rootScope, $q) {

   var swal = window.swal;

   var toastr = window.toastr;
   toastr.options.preventDuplicates = true;
   toastr.options.positionClass = 'toast-bottom-center';
   toastr.options.timeout = 3000;

   var TIPO_EXITO = 'success';
   var TIPO_ADVERTENCIA = 'warning';
   var TIPO_ERROR = 'error';
   var TIPO_INPUT = 'input';

   function alertaConTipo(titulo, mensaje, cancelable, overrides, tipo) {
      return $q(function(resolve, reject) {
         var opciones = {
            title: titulo,
            text: mensaje,
            type: tipo,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            showCancelButton: cancelable,
         };
         opciones = angular.merge(opciones, overrides);
         swal(opciones, function(isConfirm) {
            $rootScope.$evalAsync(function() {
               if (isConfirm === false) {
                  reject('cancelado');
               } else {
                  resolve(isConfirm);
               }
            });
         });
      });
   }

   this.exito = function(titulo, mensaje, cancelable, opciones) {
      return alertaConTipo(titulo, mensaje, cancelable, opciones, TIPO_EXITO);
   };

   this.error = function(titulo, mensaje, cancelable, opciones) {
      return alertaConTipo(titulo, mensaje, cancelable, opciones, TIPO_ERROR);
   };

   this.advertencia = function(titulo, mensaje, cancelable, opciones) {
      return alertaConTipo(titulo, mensaje, cancelable, opciones, TIPO_ADVERTENCIA);
   };

   this.pregunta = function(titulo, mensaje, cancelable, opciones) {
      return alertaConTipo(titulo, mensaje, cancelable, opciones, TIPO_INPUT);
   };

   this.toastError = function(mensaje) {
      toastr.error(mensaje);
   };

   this.toastSuccess = function(mensaje) {
      toastr.success(mensaje);
   };

});
