'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:HistoricorutaCtrl
 * @description
 * # HistoricorutaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('RutaDiaCtrl', function($scope, ruta, catalogoGeneral, $state,
      uiGmapGoogleMapApi) {

      $scope.setTitle('Ruta del Día');

      $scope.vistaTabla = true;

      $scope.clientes = [];
      $scope.rutaActual = null;
      $scope.agregandoCliente = false;

      $scope.$on('show-menu', function() {
         if ($scope.map.control.refresh) {
            $scope.map.control.refresh();
         }
      });

      var mostrarMapaPrimeraVez = $scope.$watch('vistaTabla', function(nval, oval) {
         if (nval !== oval) {
            $scope.$applyAsync(function() {
               $scope.map.control.refresh($scope.map.center);
            });
            mostrarMapaPrimeraVez();
         }
      });

      $scope.tiposFiltro = [{
         label: 'Todos',
         id: 0,
      }, {
         label: 'Sin Iniciar',
         id: 1,
      }, {
         label: 'En Proceso',
         id: 2,
      }, {
         label: 'Terminados',
         id: 3,
      }, ];
      $scope.estatus = $scope.tiposFiltro[0];

      /*catalogoGeneral.obtenerMisClientes()
         .then(function(clientes) {
            $scope.clientes = clientes;
         });*/

      $scope.buscarClienteJefeSucursal = function(texto) {
         return catalogoGeneral.buscarClienteJefeSucursal(texto);
      };

      ruta.obtenerRutas()
         .then(function(rutas) {
            rutas.forEach(function(r) {
               r.label = r.Responsable.Usuario + ' - ' + r.Responsable.Nombre + ' ' + r.Responsable.Nombre2;
            });
            $scope.rutas = rutas;
            var idRuta = $state.params.ruta;
            if (idRuta) {
               idRuta = parseInt(idRuta);
               $scope.usuario = rutas.filter(function(ruta) {
                  return ruta.ID === idRuta;
               }).pop();
               if ($scope.usuario) {
                  $scope.buscarRuta();
               }
            }
         });

      $scope.map = {
         center: {
            latitude: 25.7,
            longitude: -100.4,
         },
         zoom: 12,
         markers: [],
         options: {
            scrollwheel: false,
         },
         control: {},
         path: [],
         pathVisible: true,
         stroke: {}
      };

      $scope.resetRuta = function() {
         $scope.rutaActual = null;
         $scope.ruta = null;
         $scope.map.markers = [];
         $scope.map.markersFiltrados = [];
         $scope.map.path = [];
         colocarParametroRuta(null);
         $scope.agregandoCliente = false;
      };

      function colocarParametroRuta(idRuta) {
         $state.transitionTo($state.current.name, {
            ruta: idRuta
         }, {
            notify: false
         });
      }

      $scope.buscarRuta = function() {
         var idRuta = $scope.usuario.ID;
         $scope.map.markers = [];
         $scope.rutaActual = $scope.usuario;

         colocarParametroRuta(idRuta);

         if (idRuta) {
            ruta.obtenerRutaDia(idRuta)
               .then(function(ruta) {
                  ruta.forEach(function(visita) {
                     visita.Estatus = 'Sin Iniciar';
                     visita.EstatusID = 1;
                     visita.icono = 'fa-clock-o';
                     if (visita.InicioVisita) {
                        visita.Estatus = 'En Proceso';
                        visita.EstatusID = 2;
                        visita.icono = 'fa-play text-primary';
                     }
                     if (visita.FinVisita) {
                        visita.Estatus = 'Terminado';
                        visita.EstatusID = 3;
                        visita.icono = 'fa-check text-success';
                     }
                     if (visita.GPSInicio) {
                        var partes = visita.GPSInicio.split(',');
                        visita.coords = {
                           latitude: parseFloat(partes[0]),
                           longitude: parseFloat(partes[1]),
                        };
                     }
                     if (visita.PDV.Latitud && visita.PDV.Longitud) {
                        visita.coords = {
                           latitude: visita.PDV.Latitud,
                           longitude: visita.PDV.Longitud,
                        };
                     }
                     visita.icon = 'images/marker_green.png';
                     if (!visita.InicioVisita) {
                        visita.icon = 'images/marker_gray.png';
                     } else if (!visita.FinVisita) {
                        visita.icon = 'images/marker_blue.png';
                     }
                  });

                  uiGmapGoogleMapApi.then(function() {
                     // Crear lineas
                     /* globals google */

                     $scope.map.windowOptions = {
                        visible: false,
                        infoOptions: {
                           pixelOffset: new google.maps.Size(0, -35, 'px', 'px'),
                        }
                     };

                     $scope.map.path = ruta
                        .filter(function(elt) {
                           return elt.InicioVisita;
                        })
                        .sort(function(a, b) {
                           a = a.InicioVisita;
                           b = b.InicioVisita;
                           return a < b ? -1 : a > b ? 1 : 0;
                        })
                        .map(function(visita) {
                           return visita.coords;
                        }).reverse();
                     $scope.map.stroke = {
                        weight: 2,
                        color: 'green'
                     };
                     $scope.map.pathIcons = [{
                        icon: {
                           path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW
                        },
                        offset: '25px',
                        repeat: '50px'
                     }];

                  });

                  $scope.map.markers = ruta;
                  $scope.map.markersFiltrados = ruta;
                  $scope.ruta = ruta;

                  var centro = {
                     latitude: 0,
                     longitude: 0
                  };

                  var cuenta = 0;
                  ruta.forEach(function(visita) {
                     if (visita.coords.latitude && visita.coords.longitude) {
                        centro.latitude += visita.coords.latitude;
                        centro.longitude += visita.coords.longitude;
                     }
                     cuenta++;
                  });

                  if (centro.latitude !== 0 && centro.longitude !== 0) {
                     centro.latitude /= cuenta;
                     centro.longitude /= cuenta;

                     $scope.map.center = centro;
                  }
               })
               .catch(function(err) {
                  console.log(err);
               });
         }
      };

      function filtroNombre(visita) {
         if (!$scope.nombre || $scope.nombre.trim() === '') {
            return true;
         }

         var nombre = $scope.nombre.split(' ').map(function(str) {
            return str.trim().toUpperCase();
         });
         var visitaNombre = visita.PDV.Nombre.toUpperCase();

         return nombre.every(function(test) {
            return visitaNombre.indexOf(test) !== -1;
         });
      }

      function filtroEstatus(visita) {
         if ($scope.estatus.id === 0) {
            return true;
         }

         return visita.EstatusID === $scope.estatus.id;
      }

      $scope.filtroClientes = function(visita) {
         return filtroNombre(visita) && filtroEstatus(visita);
      };

      $scope.filtroAgregarCliente = function(cliente) {
         return !$scope.ruta || $scope.ruta.every(function(visita) {
            return visita.PDV.ID !== cliente.ID;
         });
      };

      $scope.agregarCliente = function() {
         $scope.agregandoCliente = true;
      };

      $scope.seleccionarCliente = function() {
         $scope.agregandoCliente = false;
         if ($scope.clienteAgregar) {
            ruta.agregarClienteARuta($scope.clienteAgregar, $scope.usuario.ID)
               .then(function() {
                  $scope.buscarRuta();
               });
         }
         $scope.clienteAgregar = null;
      };

      $scope.windowOpen = function(marker, evento, modelo) {
         $scope.visitaVentana = modelo;
         $scope.map.windowOptions.coords = modelo.coords;
         $scope.map.windowOptions.visible = true;
      };

      $scope.windowClose = function() {
         $scope.map.windowOptions.visible = false;
      };

      var markersFiltrados = function() {
         return $scope.map.markers.filter($scope.filtroClientes);
      };

      $scope.$watchGroup(['estatus', 'nombre'], function () {
        $scope.map.markersFiltrados = markersFiltrados($scope.map.markers);
        $scope.map.pathVisible = $scope.map.markersFiltrados.length === $scope.map.markers.length;
      });

   });
