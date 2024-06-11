'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:SupervisionUsuarioCtrl
 * @description
 * # SupervisionUsuarioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('SupervisionUsuarioCtrl',
      function($scope, $timeout, $log, $state, moment, uiGmapGoogleMapApi, uiGmapIsReady, miRuta, miUsuario) {
         $scope.ruta = miRuta;
         $scope.usuario = miUsuario;

         if (!$state.params.idUsuario) {
            $state.go('supervision');
            return;
         } else {
            $scope.setTitle('Visitas de ' + $scope.usuario.Nombre + ' ' + $scope.usuario.ApellidoPaterno);
         }

         var showMenu = $scope.$on('show-menu', function() {
            $scope.diagrama.resize();
         });

         $scope.$on('$destroy', function() {
            if (showMenu) {
               showMenu();
            }
         });

         function splitCoords(strCoords) {
            var comaIdx = strCoords.indexOf(',');
            if (comaIdx > 0) {
               return {
                  latitude: +strCoords.slice(0, comaIdx),
                  longitude: +strCoords.slice(comaIdx + 1),
               };
            } else {
               return null;
            }
         }

         $scope.map = {
            center: {
               latitude: 25.6964883,
               longitude: -100.3553926
            },
            zoom: 13,
            control: {},
            options: {
               scrollwheel: false
            }
         };

         var coordCentro = {
            latitude: 0,
            longitude: 0,
         };
         var markers = $scope.ruta.map(function(visita) {
            var coords = null;
            if (visita.GPSInicio) {
               coords = splitCoords(visita.GPSInicio);
            } else if (visita.PDV.Latitud && visita.PDV.Longitud) {
               coords = {
                  latitude: visita.PDV.Latitud,
                  longitude: visita.PDV.Longitud,
               };
            }

            if (coords) {
               coordCentro.latitude += coords.latitude;
               coordCentro.longitude += coords.longitude;

               return {
                  Coords: coords,
                  options: {},
                  icon: visita.InicioVisita ? 'images/marker_green.png' : 'images/marker_gray.png',
                  visita: visita,
                  id: visita.ID
               };
            }

            return null;
         });
         markers = markers.filter(function(marker) {
               return marker && marker.Coords.latitude && marker.Coords.longitude;
            })
            .sort(function(a, b) {
               return moment(a.visita.InicioVisita).diff(moment(b.visita.InicioVisita));
            });
         coordCentro.latitude = coordCentro.latitude / markers.length;
         coordCentro.longitude = coordCentro.longitude / markers.length;
         $scope.map.markers = markers;
         if (markers.length > 0) {
            // $scope.map.center = coordCentro;
         }

         $scope.$watch('map.control.getGMap', function(n) {
            if (n && $scope.map.markers.length) {
              $timeout(function () {
                var bounds = {
                  west: _($scope.map.markers).map('Coords.longitude').min(),
                  east: _($scope.map.markers).map('Coords.longitude').max(),
                  north: _($scope.map.markers).map('Coords.latitude').max(),
                  south: _($scope.map.markers).map('Coords.latitude').min(),
                };
                console.log('bounds', bounds);
                var gmap = $scope.map.control.getGMap();
                gmap.fitBounds(bounds);
              }, 500);
            }
         });

         uiGmapGoogleMapApi.then(function() {
            // Crear marcadores

            /* globals google */
            $scope.map.windowOptions = {
               visible: false,
               infoOptions: {
                  pixelOffset: new google.maps.Size(0, -35, 'px', 'px'),
               }
            };

            $scope.visitaHover = null;
            $scope.map.path = markers
               .filter(function(marker) {
                  return marker.visita.InicioVisita;
               })
               .map(function(marker) {
                  return marker.Coords;
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

         $scope.windowOpen = function(marker, evento, modelo) {
            $scope.visitaVentana = modelo.visita;
            $scope.map.windowOptions.coords = modelo.Coords;
            $scope.map.windowOptions.visible = true;
         };
         $scope.windowClose = function() {
            $scope.map.windowOptions.visible = false;
         };

         $scope.enterMarker = function(marker, evento, modelo) {
            $scope.visitaHover = modelo.visita.ID;
         };
         $scope.exitMarker = function() {
            $scope.visitaHover = null;
         };

         $scope.diferenciaFechas = function(inicio, fin) {
            if (!inicio || !fin) {
               return '';
            }

            var duracion = moment.duration(moment(fin).diff(inicio));

            return duracion.hours() + ' hora(s) ' + duracion.minutes() + ' minuto(s)';
         };

         $scope.trasladoVisita = function(visita) {
            if (visita.InicioVisita) {
               var inicioVisita = moment(visita.InicioVisita);
               var visitaAnterior = $scope.ruta
                  .filter(function(v) {
                     return v.FinVisita && v.ID !== visita.ID;
                  })
                  .map(function(v) {
                     return moment(v.FinVisita);
                  })
                  .filter(function(f) {
                     return f.isBefore(inicioVisita);
                  });
               if (visitaAnterior.length) {
                  visitaAnterior = visitaAnterior.reduce(function(p, c) {
                     return moment.max(p, c);
                  });
                  var duracion = moment.duration(inicioVisita.diff(visitaAnterior));
                  var minutos = duracion.minutes();
                  var horas = duracion.hours();
                  if (horas) {
                     return horas + ' horas ' + minutos + ' minutos';
                  }
                  return duracion.minutes() + ' minutos';
               }
            }

            return '';
         };

      }
   );
