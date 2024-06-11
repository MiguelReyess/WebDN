'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.configuracionCuestionario
 * @description
 * # configuracionCuestionario
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('configuracionCuestionario', function($http, Upload, configuracion,
      webservices) {

      var urlServicio = configuracion.DireccionActiva;
      var urlGraphql = configuracion.webServiceGraphql

      this.subirCSV = function(archivo) {
         var upload = Upload.upload({
            url: urlServicio + 'Cuestionario/ValidarPDVs',
            data: {
               file: archivo,
            },
         });

         return upload;
      };

      this.guardar = function(datos) {
         return webservices.post('Cuestionario/Configuracion', datos);
      };

      this.cancelar = function(id) {
         return webservices.delete('Cuestionario/Configuracion/' + id);
      };

      this.guardarv2 = function(datos) {
         let PDVsAsignados = datos.PDVsAsignados.map(function (item) { return { ID: item.ID }})
         let PuestosAplica = datos.PuestosAplica.map(function (item) { return { ID: item.ID, Descripcion: item.Descripcion } })

         let input = {
            questionnaireId: datos.Cuestionario._id,
            applicationSlug: 'dn-app',
            TipoCuestionario: datos.TipoCuestionario,
            FechaInicio: datos.FechaInicio,
            FechaFin: datos.FechaFin,
            Titulo: datos.Titulo,
            DescCorta: datos.DescCorta,
            Codigo: datos.Codigo,
            ForzarGuardado: datos.ForzarGuardado,
            PDVsAsignados: PDVsAsignados,
            PuestosAplica: PuestosAplica,
            FechaTermino: datos.FechaTermino,
            Orden: datos.Orden,
            active: datos.true,
            createdBy: null,
            updatedBy: null,
            createdAt: new Date(),
            updatedAt: new Date()
         }

         console.log('input >>', input)

         debugger

         return new Promise((resolve, reject) => {
            axios.post(urlGraphql, {
               query: `mutation updateSettingQuestionnaire($input: SettingQuestionInput) {
                     updateSettingQuestionnaire(input: $input) {
                        questionnaireId {
                           _id
                           name
                         }
                         applicationSlug
                         TipoCuestionario
                         FechaInicio
                         FechaFin
                         Titulo
                         DescCorta
                         Codigo
                         ForzarGuardado
                         PDVsAsignados
                         PuestosAplica
                         FechaTermino
                         Orden
                         active
                         createdBy
                         updatedBy
                         deletedAt
                         createdAt
                         updatedAt
                     }
                  }
               `,
               variables: {
                  input
               }
             }).then(response => {
               resolve(response.data.data.getQuestionnaires)
             }, error => {
                reject(error)
             })
         })

         // return webservices.post('Cuestionario/Configuracion', datos);
      };


      this.obtenerDePersona = function(idPersona) {
         return webservices.get('Cuestionario/Configuracion/Persona/' + idPersona);
      };

      this.guardarDePersona = function(idPersona, configs) {
         return webservices.put('Cuestionario/Configuracion/Persona/' + idPersona, configs);
      };

      this.obtenerTodos = function() {
         return webservices.get('Cuestionario/Configuracion');
      };

      this.obtenerDePDV = function(idPDV) {
         return webservices.get('Cuestionario/Configuracion/PDV/' + idPDV);
      };

      this.guardarDePDV = function(idPDV, configs) {
         return webservices.put('Cuestionario/Configuracion/PDV/' + idPDV, configs);
      };

   });
