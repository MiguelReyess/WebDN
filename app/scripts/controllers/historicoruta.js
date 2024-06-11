'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:HistoricorutaCtrl
 * @description
 * # HistoricorutaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('HistoricoRutaCtrl', function($scope, ruta, SweetAlert, $state,
      uiGmapGoogleMapApi) {

      $scope.setTitle('Histórico de Ruta');

      $scope.vistaTabla = true;
      $scope.fecha = new Date();
      $scope.clientes = [];

      $scope.$on('show-menu', function() {
         if ($scope.map.control.refresh) {
            $scope.map.control.refresh();
         }
      });

      var mostrarMapaPrimeraVez = $scope.$watch('vistaTabla', function(nval) {
         if (nval === false) {
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

      ruta.obtenerRutas()
         .then(function(rutas) {
            rutas.forEach(function(r) {
               r.label = r.Responsable.Usuario + '  -  ' + r.Responsable.Nombre + ' ' + r.Responsable.Nombre2+ ' ' +r.Responsable.ApellidoPaterno+ ' ' +r.Responsable.ApellidoMaterno;
            });
            $scope.rutas = rutas;

            var idRuta = $state.params.ruta;
            var fecha = $state.params.fecha;
            if (idRuta && fecha) {
               $scope.fecha = fecha;

               idRuta = parseInt(idRuta);
               $scope.usuario = rutas.filter(function(ruta) {
                  return ruta.ID === idRuta;
               }).pop();
               if ($scope.usuario && fecha) {
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
         path: [],
         options: {
            scrollwheel: false,
         },
         control: {},
      };

      function colocarParametroRuta(idRuta, fecha) {
         $state.transitionTo($state.current.name, {
            ruta: idRuta,
            fecha: fecha,
         }, {
            notify: false
         });
      }

      $scope.buscarRuta = function() {
         var idRuta = $scope.usuario.ID;
         var fecha = $scope.fecha;

         colocarParametroRuta(idRuta, fecha);

         $scope.map.markers = [];
         if (idRuta && fecha) {
            ruta.obtenerRutaDeFecha(idRuta, fecha)
               .then(function(ruta) {
                  if (ruta.length === 0) {
                     SweetAlert.info('No hay ruta', 'No se encotró ruta para este día.');
                     return;
                  }
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
                        .map(function(visita) {
                           return visita.coords;
                        }).reverse();
                     $scope.map.stroke = {
                        weight: 3,
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

      $scope.windowOpen = function(marker, evento, modelo) {
         console.log(modelo);
         $scope.visitaVentana = modelo;
         $scope.map.windowOptions.coords = modelo.coords;
         $scope.map.windowOptions.visible = true;
      };

      $scope.windowClose = function() {
         $scope.map.windowOptions.visible = false;
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

      $scope.abrirDetalle = function(visita) {
         $state.go('detalle-visita', {
            idVisita: visita.ID
         });
      };

   });
