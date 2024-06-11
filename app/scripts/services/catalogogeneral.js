'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.catalogoGeneral
 * @description
 * # catalogoGeneral
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('catalogoGeneral', function($q, $http, configuracion) {
      var url = configuracion.DireccionActiva;
      var urlGraphql = configuracion.webServiceGraphql

      function obtenerLista(url) {
         var mUrl = url;

         for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            mUrl = mUrl.replace('{' + i + '}', arg);
         }

         return $http.get(mUrl)
            .then(function(resp) {
               return resp.data.Datos;
            })
            .catch(function(err) {
               throw err.data;
            });
      }

      return {
         obtenerPaises: function() {
            return obtenerLista(url + 'Pais');
         },
         obtenerEstados: function(idPais) {
            return obtenerLista(url + 'Pais/{1}/Estado', idPais);
         },
         obtenerMunicipios: function(idPais, idEstado) {
            return obtenerLista(url + 'Pais/{1}/Estado/{2}/Municipio', idPais, idEstado);
         },
         obtenerTiposCliente: function() {
            return obtenerLista(url + 'PDV/TipoCliente');
         },
         obtenerCanales: function() {
            return obtenerLista(url + 'Canal');
         },
         obtenerAsesoresComerciales: function() {
            return obtenerLista(url + 'Usuario/AsesoresComerciales');
         },
         obtenerCadenas: function() {
            return obtenerLista(url + 'Catalogo/Cadena');
         },
         obtenerZonas: function() {
            return obtenerLista(url + 'Catalogo/Zona');
         },
         obtenerGruposCanales: function() {
            return obtenerLista(url + 'Catalogo/GrupoCanal');
         },
         obtenerPromotores: function() {
            return obtenerLista(url + 'Usuario/PersonasACargo/All');
         },
         obtenerFuncionales: function () {
            return obtenerLista(url + 'Usuario/PersonasACargoConFuncional');
         },
         obtenerTiposRuta: function() {
            return obtenerLista(url + 'Catalogo/TipoRuta');
         },
         obtenerTiposCuestionario: function() {
            return obtenerLista(url + 'Cuestionario/TipoCuestionario');
         },
         obtenerReportesDisponibles: function() {
            return obtenerLista(url + 'Reporte/Disponibles');
         },
         obtenerCuestionarios: function() {
            return obtenerLista(url + 'Cuestionario');
         },
         obtenerCuestionariosv2: function() {
            return new Promise((resolve, reject) => {
               axios.post(urlGraphql, {
                  query: `
                     query getQuestionnaires($filters: FiltersQuestionnaire) {
                        getQuestionnaires(filters: $filters) {
                           _id
                           name
                           slug
                           description
                           schemas
                           setting {
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
                     filters: {
                        active: 1,
                        applications: [{ display_name: 'dn-app' }]
                     }
                  }
                }).then(response => {
                  resolve(response.data.data.getQuestionnaires)
                }, error => {
                   reject(error)
                })
            })

            // return obtenerLista(url + 'Cuestionario');
         },
         obtenerCuestionariosEvidencia: function() {
            return obtenerLista(url + 'Cuestionario/Evidencia')
         },
         obtenerMarcas: function() {
            return obtenerLista(url + 'Cuestionario/Evidencia')
         },
         buscarCliente: function(nombre, cadena) {
            var params = {
               nombre: nombre,
            };
            if (cadena) {
               params.cadena = cadena;
            }
            return $http.get(url + 'PDV/Find', {
                  params: params,
               })
               .then(function(resp) {
                  return resp.data.Datos;
               });
         },
         buscarClienteJefeSucursal: function(nombre) {
            console.log(nombre);
            var params = {
               nombre: nombre,
            };
            return $http.get(url + 'PDV/BuscarPorJefeFuncional', {
                  params: params,
               })
               .then(function(resp) {
                  return resp.data.Datos;
               });
         },
         obtenerPuestos: function() {
            return $q.resolve(
               [{
                  ID: 3,
                  Descripcion: 'Asesor Comercial'
               }, {
                  ID: 4,
                  Descripcion: 'Promotor'
               }, {
                  ID: 11,
                  Descripcion: 'Gerente Canal'
               }, {
                  ID: 12,
                  Descripcion: 'Gerente Zona'
               }, {
                  ID: 14,
                  Descripcion: 'Vendedor JR'
               }, {
                  ID: 15,
                  Descripcion: 'OPV'
               }, {
                  ID: 17,
                  Descripcion: 'Demostrador'
               },{
                  ID: 8, 
                  Descripcion: 'Coordinador'
               },
             ]
            );
         },
         obtenerPerfiles: function() {
            return $q.resolve(
               [{
                  ID: 10,
                  Descripcion: 'Supervisor DN',
               }, {
                  ID: 11,
                  Descripcion: 'Promotor DN',
               }, {
                  ID: 12,
                  Descripcion: 'Demostrador DN',
               }, ]
            );
         },
         obtenerDominios: function() {
            return $q.resolve(
               [{
                  ID: 1,
                  Nombre: 'RAGASA.CORP',
                  Descripcion: 'Dominio de Ragasa'
               }]
            );
         },
         obtenerSistemas: function() {
            return $q.resolve(
               [{
                  ID: 4,
                  DescCorta: 'DN Mobile',
                  DescLarga: 'Sic DN Mobile'
               }, {
                  ID: 6,
                  DescCorta: 'DN Web',
                  DescLarga: 'Sistema DN Web'
               }, ]
            );
         },
         obtenerMisClientes: function() {
            return obtenerLista(url + 'PDV/MisClientes');
         }
      };

   });
