'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:OrganigramaCtrl
 * @description
 * # OrganigramaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('OrganigramaCtrl', function($scope, $http, $log, configuracion,
      DNConfig, interceptorPersonificar) {
      var url = configuracion.DireccionActiva;

      $scope.setTitle('Organigrama');
      $scope.diagrama = null;

      var showMenu = $scope.$on('show-menu', function() {
         if ($scope.diagrama) {
            $scope.diagrama.resize();
         }
      });

      $scope.$on('$destroy', function() {
         if (showMenu) {
            showMenu();
         }
      });

      var data = [];

      function visualTemplate(options) {
         var dataviz = kendo.dataviz;
         var g = new dataviz.diagram.Group();
         var dataItem = options.dataItem;

         g.append(new dataviz.diagram.Rectangle({
            width: 300,
            height: 75,
            stroke: {
               width: 1,
               color: '#343434'
            },
            fill: {
               color: '#fff'
            }
         }));

         g.append(new dataviz.diagram.TextBlock({
            text: dataItem.Nombre + ' ' + dataItem.ApellidoPaterno,
            x: 85,
            y: 20,
            fill: '#656565'
         }));

         g.append(new dataviz.diagram.TextBlock({
            text: dataItem.Puesto.Descripcion,
            x: 85,
            y: 40,
            fill: '#2C2C2C'
         }));

         g.append(new dataviz.diagram.Image({
            source: 'images/hoja_ragasa_xs.png',
            x: 3,
            y: 3,
            width: 68,
            height: 68
         }));

         return g;
      }

      function obtenerOpciones() {
         return {
            dataSource: new kendo.data.HierarchicalDataSource({
               data: data,
               schema: {
                  model: {
                     children: 'Empleados',
                     id: 'Usuario',
                  }
               }
            }),
            layout: {
               type: 'tree',
               subtype: 'tipOver'
            },
            click: function(e) {
               if (e.item instanceof kendo.dataviz.diagram.Shape) {
                  $log.info(e.item.dataItem.Usuario);

                  expandirUsuario(e.item.dataItem);
               }
            },
            shapeDefaults: {
               visual: visualTemplate,
               editable: false,
               selectable: false,
            },
            connectionDefaults: {
               editable: false,
               stroke: {
                  color: '#979797',
                  width: 2
               }
            },
            pannable: {
               key: 'alt'
            }
         };
      }

      function prepararDatos(persona) {
         if (persona.Empleados !== null && persona.Empleados.length > 0) {
            for (var i = 0; i < persona.Empleados.length; i++) {
               prepararDatos(persona.Empleados[i]);
            }
         } else {
            delete persona.Empleados;
         }
      }

      function personasDeUsuario(usuario, topLevel) {
         return $http.get(url + 'Usuario/PersonasJerarquia/' + usuario, {
               params: {
                  topLevel: topLevel || 0
               }
            })
            .then(function(resp) {
               prepararDatos(resp.data.Datos);
               return resp.data.Datos;
            });
      }

      function expandirUsuario(item) {
         if (!item.Empleados || !item.Empleados.length) {
            personasDeUsuario(item.Usuario, 2)
               .then(function(datos) {
                  $log.info(datos);

                  if (datos.Empleados && datos.Empleados.length) {
                     datos.Empleados.forEach(function(e) {
                        item.append(e);
                     });
                  }
               });
         }
      }

      var usuario = interceptorPersonificar.getUsuarioPersonificar() || DNConfig.getUsuarioActivo();

      personasDeUsuario(usuario.Usuario, 2)
         .then(function(datos) {
            data = [datos];
            $scope.options = obtenerOpciones();
         });

   });
