'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.excelServidor
 * @description
 * # excelServidor
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('excelServidor', function(webservices, configuracion,
   $httpParamSerializer) {

   this.generar = function(reporte, page, pageSize, codigo, pdv, inicio, fin,
      cadena, usuario, filename) {
      var params = {
         reporte: reporte,
         codigo: codigo,
         pdv: pdv,
         inicio: inicio,
         fin: fin,
         cadena: cadena,
         usuario: usuario,
         page: page,
         pageSize: pageSize,
         filename: filename,
      };

      return webservices.post('Reporte/Generar/xlsx', null, {
         params: params
      });
   };

   this.generarURL = function(guid, nombreArchivo) {
      var filename = $httpParamSerializer({
         fileName: nombreArchivo
      });
      return configuracion.DireccionActiva + 'Reporte/{nombre}/xlsx'.replace('{nombre}', guid) + '?' +
         filename;
   };

});
