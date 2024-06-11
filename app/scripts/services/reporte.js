'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.reporte
 * @description
 * # reporte
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('reporte', function($http, configuracion) {

      var url = configuracion.DireccionActiva;

      this.buscar = function(reporte, page, pageSize, codigo, pdv, inicio, fin, cadena, usuario) {
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
         };

         return $http.get(url + 'Reporte', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.registroInformacion = function(page, pageSize, inicio, fin, usuario) {
         var params = {
            inicio: inicio,
            fin: fin,
            usuario: usuario,
            page: page,
            pageSize: pageSize,
         };


         return $http.get(url + 'Reporte/RegistroInformacion', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.tiemposTraslados = function(page, pageSize, inicio, fin, usuario) {
         var params = {
            inicio: inicio,
            fin: fin,
            usuario: usuario,
            page: page,
            pageSize: pageSize,
         };

         return $http.get(url + 'Reporte/TiemposYTraslados', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.tareasYActividades = function (page, pageSize, inicio, fin, cadena) {
         var params = {
            inicio: inicio,
            fin: fin,
            cadena: cadena,
            page: page,
            pageSize: pageSize,
         };

         return $http.get(url + 'Reporte/TareasYActividades', {
            params: params
         })
            .then(function (resp) {
               return resp.data.Datos;
            });
      };

      this.obtenerJustificaciones = function (page, pageSize, inicio, fin, usuario) {

         var params = {
            FechaInicio: inicio,
            FechaFin: fin,
            UsuarioID: usuario,
            page: page,
            pageSize: pageSize,
         };
         return $http.get(url + 'Reporte/ListadoJustificaciones', {
            params: params
         })
            .then(function (resp) {
               return resp.data.Datos;
            })
            .catch(function (err) {

            });
      };

      this.productosPorPDV = function(page, pageSize) {
         var params = {
            page: page,
            pageSize: pageSize,
         };

         return $http.get(url + 'Reporte/ProductosPorPDV', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.pdvsSinAsignar = function(page, pageSize) {
         var params = {
            page: page,
            pageSize: pageSize,
         };

         return $http.get(url + 'Reporte/PDVsSinAsignar', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.configuracionRutas = function(usuario, cadena, idPDV, page, pageSize) {
         var params = {
            usuario: usuario,
            cadena: cadena,
            idPDV: idPDV,
            page: page,
            pageSize: pageSize,

         };

         return $http.get(url + 'Reporte/ConfiguracionRutas', {
               params: params
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

      this.codigosTiempoYForma = function(fechaInicio, fechaFin){
         var servicio = url + 'Reporte/ConfiguracionCuestionario/' + moment(fechaInicio).format('YYYY-MM-DD') + '/' + moment(fechaFin).format('YYYY-MM-DD');

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.tiempoYFormaCodigoDetalle = function(fechaInicio, fechaFin, codigo){
         var servicio = url + 'Reporte/ConfiguracionCuestionario/' + moment(fechaInicio).format('YYYY-MM-DD') + '/' + moment(fechaFin).format('YYYY-MM-DD') + '/' + codigo;

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.tiempoYFormaCodigoDetalleXlsx = function(fechaInicio, fechaFin, codigo){
         var servicio = url + 'Reporte/ConfiguracionCuestionario/';
         servicio = servicio + moment(fechaInicio).format('YYYY-MM-DD');
         servicio = servicio  + '/';
         servicio = servicio + moment(fechaFin).format('YYYY-MM-DD');
         servicio = servicio + '/' + codigo;
         servicio = servicio + '/xlsx';

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.imagenes = function(fechaInicio, fechaFin, idCuestionario, idMarca, idUsuario, idCadena, idPDV) {
            var params = {
                  inicio: moment(fechaInicio).format('YYYY-MM-DD'),
                  fin: moment(fechaFin).format('YYYY-MM-DD'),
                  idCuestionario: idCuestionario,
                  idMarca: idMarca,
                  idUsuario: idUsuario,
                  idCadena: idCadena,
                  idPDV: idPDV
            };

            return $http.get(url + 'Reporte/Imagenes', {
                              params: params
                        })
                        .then(function(resp) {
                              return resp.data.Datos;
                        });
      };

      this.ingresoUsuariosSistemaMovil = function(rango){
         var servicio = url + 'Reporte/Ingreso/Usuarios/Movil/Rango/'+ rango;

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.ingresoEjecutivos = function(rango, sistema){
         var servicio = url + 'Reporte/Ingreso/Ejecutivos/Rango/'+ rango +'/Sistema/' +sistema;

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.conteoIngresoEjecutivos = function(sistema){
         var servicio = url + 'Reporte/Conteo/Ingreso/Ejecutivos/Sistema/' +sistema;

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.usuariosSesionActiva = function(){
         var servicio = url + 'Reporte/Usuarios/Sesion/Activa/0';

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.usuariosSesionActivaDetalle = function(){
         var servicio = url + 'Reporte/Usuarios/Sesion/Activa/1';

         return $http.get(servicio).then(function(resp){
            return resp.data.Datos;
         });
      };

      this.reporteHistoricoVisitasPorPDV = function(fechaInicio, fechaFin, idPDV) {
         var servicio = url + 'Reporte/Visitas/' + idPDV + '?fecha_inicio=' + fechaInicio + '&fecha_fin=' + fechaFin;

         return $http.get(servicio)
            .then(function(resp) {
               return resp.data.Datos;
            });
      }

   });
