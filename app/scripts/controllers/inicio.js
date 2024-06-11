'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:InicioCtrl
 * @description
 * # InicioCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
   .controller('InicioCtrl', ['$scope','indicadoresoperativosServices','DNConfig','usuario','interceptorPersonificar','leafletData','ruta','$state',
      function($scope,indicadoresoperativosServices, DNConfig,usuario,interceptorPersonificar,leafletData,ruta,$state) {
         $scope.setTitle('Inicio');

         function obtenerInformacionRuta() {
            
            $scope.usuarioActivo = interceptorPersonificar.getUsuarioPersonificar() || DNConfig.getUsuarioActivo();
            //$scope.usuarioActivo.Usuario = 'amartinez';
            indicadoresoperativosServices.ObtenerIndicadoresRuta($scope.usuarioActivo.Usuario)
                 .then(function(resp) {
                     console.log(resp);
                     $scope.InformacionRuta = [];
                     if (resp) {
                         $scope.InformacionRuta = resp.Datos;
                     }
                 })
                 .catch(function() {});
         }

         function obtenerInformacionGeneral() {
            
            $scope.usuarioActivo = DNConfig.getUsuarioActivo();
            //$scope.usuarioActivo.Usuario = 'amartinez';
            indicadoresoperativosServices.ObtenerIndicadoresGenerales($scope.usuarioActivo.Usuario)
                 .then(function(resp) {
                     console.log(resp);
                     $scope.InformacionGeneral = [];
                     if (resp) {
                         $scope.InformacionGeneral = resp.Datos;
                     }
                 })
                 .catch(function() {});
         }

         $scope.filtros = {
             fechaInicio: moment().toDate(),
             fechaFin: moment().toDate()
         };
         $scope.hayInformacionIndicadores = false;
         $scope.fechaActual = moment().format('dddd D [de] MMMM [de] YYYY');

         obtenerInformacionRuta();
         obtenerInformacionGeneral();

         $scope.updateInformacionRuta = function(){ 
           obtenerInformacionRuta();
           obtenerInformacionGeneral();

        };

         $scope.calcularTotalVisitas = function() {
             var total = 0;
/*              if ($scope.InformacionRuta.length > 0) {
                 angular.forEach($scope.InformacionRuta, function(info) {
                     total += info.CantidadVisitas;
                 });
             } */
             return total;
         };

         $scope.calcularTotalPedidos = function() {
             var total = 0;
/*              if ($scope.InformacionRuta.length > 0) {
                 angular.forEach($scope.InformacionRuta, function(info) {
                     total += info.CantidadPedidos;
                 });
             } */
             return total;
         };

         $scope.calcularTotalVenta = function() {
             var total = 0;
/*              if ($scope.InformacionRuta.length > 0) {
                 angular.forEach($scope.InformacionRuta, function(info) {
                     total += info.VentaRuta;
                 });
             } */
             return total;
         };

         var map = {
            bounds: {},
            center: {
              lat: 25.675364,
              lng: -100.3294293,
              zoom: 5
            },
            markers: {
            },
            layers: {
              baselayers: {
                osm: {
                  name: 'Mapa',
                  type: 'xyz',
                  // url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', // escala de grises
                  url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // a colores
                  layerOptions: {
                    showOnSelector: false
                  }
                }
              },
              overlays: {
                JefeTradeMarketing: {
                  name: 'Jefe Trade Marketing',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },     
                CoordinadordeTradeMarketing: {
                  name: 'Coordinador Trade Marketing',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },                              
                AsesorComercial: {
                  name: 'Asesor',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },
                OPV: {
                  name: 'OPV',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },                
                VendedorJr: {
                  name: 'Vendedor Jr',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },                               
                Promotor: {
                  name: 'Promotor',
                  type: 'markercluster',
                  visible: true,
                  layerOptions: {
                    showOnSelector: false
                  }
                },
                Visita: {
                  name: 'Visita',
                  type: 'markercluster',
                  visible: false,
                  layerOptions: {
                    showOnSelector: false
                  }
                }                
              }
            },
            events: {
              markers: {
                enable: ['click', 'mouseover', 'mouseout']
              },
              layers: {
                enable: ['click', 'mouseover', 'mouseout']
              }              
            },
            controls: {
              scale: true,
              fullscreen: {
                position: 'topleft'
              }
            },
            defaults: {
              scrollWheelZoom: true,
              zoomAnimation: true,
              markerZoomAnimation: true,
              fadeAnimation: true,
              tileLayerOptions: {
                detectRetina: true,
                reuseTiles: true,
              }
            }
          };
             
          function restoreMapSize() {
            leafletData.getMap('map').then(function (map) {
              map.invalidateSize()
            })
          }

          angular.extend($scope, map);   
          
          function dibujarPuntoEnMapa(ruta,visita, punto, TipoPunto) {
            var color = 'red';
            if (visita.FinVisita === undefined || visita.FinVisita === null){
              if (visita.InicioVisita === undefined || visita.InicioVisita === null){
                color = '#red'
              }else {             
              color = 'blue'
              }
            } else {      
              color = 'green';
            }
            var grupo = ruta.Responsable.Puesto.Descripcion.replace(/ /g, "");
            var icon = `fa-map-marker fa-3x`
            if(TipoPunto === 'Visita'){
              icon = `fa-male fa-3x`
              grupo = 'Visita'
            }

            var cadena;
            if (visita.PDV.Cadena === null){
                console.log(visita.PDV)
                cadena = "";
            }else{
                cadena = visita.PDV.Cadena.Nombre;
            }               
            //console.log(ruta.Responsable.Puesto.Descripcion.replace(/ /g, ""));
            map.markers[punto.id_user] = {
              
              layer: grupo,
              lat: punto.lat,
              lng: punto.lng,
              draggable: false,
              icon: {
                type: 'div',
                iconSize: [0, 0],
                popupAnchor: [0, 0],
                html: `<div style="position: absolute; left: -14.2px; top: -18px; color:${color}">
                    <i class="fa ${icon}"></i>
                    </div>`
              },
              label: {
                message: `
                        Ruta: ${ruta.DescCorta} <br>
                        Responsable: ${ruta.Responsable.Nombre} ${ruta.Responsable.ApellidoPaterno}<br>
                        Puesto: ${ruta.Responsable.Puesto.Descripcion}<br>
                        Asesor: ${visita.PDV.AsesorComercial.Nombre} ${visita.PDV.AsesorComercial.ApellidoPaterno}<br>
                        Cadena: ${cadena} <br>
                        Numero SIC: ${visita.PDV.ID}<br>
                        PDV: ${visita.PDV.Nombre} <br>
                        Direccion: ${visita.PDV.Direccion} <br>
                        `,
                options: {
                  noHide: false,
                  className: 'leaflet-label-top'
                }
              },
              ruta: true,
              data: ruta
            }
           
          
          }
    
          function dibujarUltimoPuntoMapa() {
            _.forEach($scope.rutas, ruta => {
              if (!ruta.Historico)
                return
              let punto = $scope.puntosTackerLive[ruta.Historico.Ruta.Responsable.ID]

              dibujarPuntoEnMapa(ruta, punto)
            })
          }
            
          ruta.obtenerRutas()
          .then(function(rutas) {
             rutas.forEach(function(r) {
                r.label = r.Responsable.Usuario + '  -  ' + r.Responsable.Nombre + ' ' + r.Responsable.Nombre2+ ' ' +r.Responsable.ApellidoPaterno+ ' ' +r.Responsable.ApellidoMaterno;
             });
             var fecha = moment();
                $scope.fecha = fecha;
 
                $scope.usuario = rutas.filter(function(ruta) {
                    return ruta.Activo === true;
                });  
                   $scope.buscarRuta();
          });
 
          $scope.buscarRuta = function() {
            var fecha = $scope.fecha;

            console.log($scope.usuario);
            $scope.usuario.forEach(function(historicoruta){
              
               ruta.obtenerRutaDeFecha(historicoruta.ID, fecha)
                  .then(function(ruta) {
                    //console.log(ruta);
                    ruta.forEach(function(visita){
                  
                     $scope.rutas = visita;
                     let puntoVisita={
                      lat : 0,
                      lng : 0,
                      dir : 0,
                      id_user : 0,
                      VelocidadKmh : 0
                    }
                    
                    let puntoPDV = {
                       lat: visita.PDV.Latitud,
                       lng: visita.PDV.Longitud,
                       dir: 0,
                       id_user: visita.PDV.ID,
                       VelocidadKmh: 0
                    };                     
                    var  TipoPunto  = 'PDV';

                     dibujarPuntoEnMapa(historicoruta,visita, puntoPDV, TipoPunto);

                     if(visita.GPSInicio != undefined && visita.GPSInicio != null)
                     {
                       var partes = visita.GPSInicio.split(',');
                       puntoVisita = {
                         lat: parseFloat(partes[0]),
                         lng: parseFloat(partes[1]),
                         dir: 0,
                         id_user: visita.ID,
                         VelocidadKmh: 0                        
                       }
                       TipoPunto  = 'Visita';

                       dibujarPuntoEnMapa(historicoruta,visita, puntoVisita, TipoPunto);                        
                     }

                    });
                 })  
                  .catch(function(err) {
                     console.log(err);
                  });
            //}
          })
         };          

        function colocarParametroRuta(idRuta, fecha) {
          $state.transitionTo($state.current.name, {
             ruta: idRuta,
             fecha: fecha,
          }, {
             notify: false
          });
        }  
        
        function borrarTodosMarcadores() {
          _.forEach(map.markers, (maker, i) => {
            delete map.markers[i];
          })
        }           
        
      }
   ]);
