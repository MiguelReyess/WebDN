'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.imagenes
 * @description
 * # imagenes
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('imagenes', function($q, $resource, $cacheFactory, configuracion) {

      var url = configuracion.DireccionActiva;

      /**
       * Originalmente regresaría los datos (bytes) de contenido del archivo,
       * pero ahora resuelve con el URL a la imagen.
       * @param  {integer} idImagen identificador de la imagen
       * @return {Promise}          resuelve a URL de imagen
       */
      this.obtenerArchivo = function(idImagen) {
         return $q.resolve(url + 'Imagen/' + idImagen + '/File');
      };

      /**
       * Regresa el URL para descargar la imagen como string.
       * @param  {integer} idImagen identificador de la imagen
       * @return {string}           URL para acceder a la imagen
       */
      this.obtenerUrl = function obtenerUrl(idImagen) {
         return url + 'Imagen/' + idImagen + '/File';
      };

   });
