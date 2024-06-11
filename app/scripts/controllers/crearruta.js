'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:CrearrutaCtrl
 * @description
 * # CrearrutaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.controller('CrearRutaCtrl', function($scope, $compile, $timeout, $q,
   catalogoGeneral, ruta, SweetAlert, moment, cliente, uiGmapGoogleMapApi,$state) {


   if($state.current.name === "rutas.editar")
   {
      
      $scope.setTitle('Editar Ruta');  
   }
   else
   {
      $scope.setTitle('Crear Ruta');

   }
   $scope.hoy = new Date();
   $scope.pdvs = [];
   $scope.clientes = [];
   $scope.ruta = {
      ID: null,
      Nombre: null,
      DescCorta: null,
      Descripcion: null,
      Responsable: null,
      TipoRuta: null,
      DetalleRuta: $scope.pdvs,
   };
   $scope.pdvSeleccionado = null;
   $scope.diaSeleccionado = 2;
   $scope.pdvHover = null;

   $scope.buscarClienteJefeSucursal = function(texto) {
      return catalogoGeneral.buscarClienteJefeSucursal(texto);
   };

   $scope.frecuencias = [{
      duracion: 1,
      nombre: '1 semana'
   }, {
      duracion: 2,
      nombre: '2 semanas'
   }, {
      duracion: 3,
      nombre: '3 semanas'
   }, {
      duracion: 4,
      nombre: '4 semanas'
   }];

   $scope.dateOptions = {
      startingDay: 1,
      showButtonBar: false,
      minDate: $scope.hoy,
   };

   $scope.pdvFecha = null;
   $scope.abrirFecha = function(pdv) {
      $scope.pdvFecha = pdv;
   };
   $scope.diaValido = function(fecha) {
      return fecha.getDay() !== 0; // Solo domingo
   };

   /*catalogoGeneral.obtenerMisClientes()
      .then(function(clientes) {
         $scope.clientes = clientes;
      });*/

   catalogoGeneral.obtenerTiposRuta()
      .then(function(tipos) {
         $scope.TiposRuta = tipos;
      });

   // Promotor

   
   
      catalogoGeneral.obtenerFuncionales()
         .then(function(promotores) {
            
            $scope.Promotores = promotores.filter(promotor => promotor.Activo);
         });

   $scope.map = {
      center: {
         latitude: 25.699035,
         longitude: -100.316828
      },
      zoom: 13,
      control: {},
      options: {
         scrollwheel: false
      },
      markers: [],
      path: [],
   };

   uiGmapGoogleMapApi.then(function() {
      /* globals google */

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

   $timeout(function() {
      $('#tabsPDV a').click(function(e) {
         e.preventDefault();
         $(this).tab('show');
      });
   });

   var showMenuBefore = $scope.$on('show-menu-before', function() {

   });

   var showMenu = $scope.$on('show-menu', function() {

   });

   if($state.current.name === "rutas.editar")
   {
      obtenerRuta($state.params.idruta);
   }

   $scope.$on('$destroy', function() {
      if (showMenu) {
         showMenu();
      }
      if (showMenuBefore) {
         showMenuBefore();
      }
   });

   function recalcularMarkers() {
      $scope.map.markers = $scope.pdvs
         .filter(function(pdv) {
            return pdv.PDV.Latitud && pdv.PDV.Longitud && pdv.dias.some(function(dia) {
               return dia.DiaSemana === $scope.diaSeleccionado && dia.OrdenVisita;
            });
         })
         .map(function(pdv) {
            var orden = pdv.dias.filter(function(dia) {
                  return dia.DiaSemana === $scope.diaSeleccionado;
               })
               .map(function(dia) {
                  return dia.OrdenVisita;
               })
               .pop();

            return {
               coords: {
                  latitude: pdv.PDV.Latitud,
                  longitude: pdv.PDV.Longitud,
               },
               orden: orden,
               icon: 'images/marker_green.png',
               id: pdv.PDV.ID,
            };
         });

      $scope.map.path = $scope.map.markers
         .sort(function(marker1, marker2) {
            return marker1.orden - marker2.orden;
         })
         .map(function(marker) {
            return marker.coords;
         }).reverse();
   }
   $scope.recalcularMarkers = recalcularMarkers;


   $scope.enterMarker = function(marker, evento, modelo) {
      $scope.pdvHover = modelo.id;
   };
   $scope.exitMarker = function() {
      $scope.pdvHover = null;
   };
   $scope.clickMarker = function(marker, evento, modelo) {
      var seleccionado = $scope.pdvs
         .filter(function(pdv) {
            return pdv.PDV.ID === modelo.id;
         })
         .pop();
      $scope.mostrarInfoPDV(seleccionado);
   };

   $scope.agregarCliente = function() {
      var cliente = $scope.clienteAgregar;
      if (cliente) {
         $scope.pdvs.push({
            PDV: cliente,
            dias: [2, 3, 4, 5, 6, 7, 1].map(function(d) {
               return crearDia(d, 1, null, null);
            }),
            Frecuencia: 1,
            SemanaPrimerVisita: null,
         });
         $timeout(function() {
            $('[data-toggle="popover"]').popover();
         });
      }

      recalcularMarkers();
   };

   $scope.removerPDV = function(pdv) {
      $scope.pdvs = $scope.pdvs.filter(function(elt) {
         return elt !== pdv;
      });
      $scope.ruta.DetalleRuta = $scope.pdvs;

      recalcularMarkers();
   };

   function crearDia(diaSemana, frecuencia, ordenVisita, semanaPrimerVisita) {
      return {
         DiaSemana: diaSemana,
         Frecuencia: frecuencia,
         OrdenVisita: ordenVisita,
         SemanaPrimerVisita: semanaPrimerVisita,
      };
   }

   $scope.mostrarInfoPDV = function(pdv) {
      $scope.ventas = [];
      $scope.tareas = [];
      $scope.actividades = [];

      var id = pdv.PDV.ID;

      cliente.obtenerVentas(id)
         .then(function(ventas) {
            $scope.ventas = ventas;
         });
      cliente.obtenerTareas(id)
         .then(function(tareas) {
            $scope.tareas = tareas;
         });
      cliente.obtenerActividades(id)
         .then(function(actividades) {
            $scope.actividades = actividades;
         });

      $scope.pdvSeleccionado = pdv.PDV;
   };

   $scope.esDia = function(indice) {
      return $scope.diaSeleccionado === (indice + 1) % 7 + 1;
   };

   $scope.seleccionaDia = function(dia) {
      $scope.diaSeleccionado = (dia + 1) % 7 + 1;
      recalcularMarkers();
   };

   function prepararRuta(ruta) {
      var preparada = angular.merge({}, ruta);
      preparada.DetalleRuta = preparada.DetalleRuta
         .map(function(detalle) {
            return detalle.dias.filter(function(dia) {
                  return angular.isNumber(dia.OrdenVisita);
               })
               .map(function(dia) {
                  dia.PDV = detalle.PDV;
                  dia.SemanaPrimerVisita = detalle.SemanaPrimerVisita;
                  dia.Frecuencia = detalle.Frecuencia;
                  return dia;
               });
         })
         .reduce(function(prev, curr) {
            return prev.concat(curr);
         }, []);
      return preparada;
   }

   function validarRuta(ruta) {
      if ($scope.frmDatosRuta.$invalid) {
         return $q.reject('Favor de llenar los datos requeridos de la ruta.');
      } else if (ruta.DetalleRuta.length === 0) {
         return $q(function(exito, error) {
            SweetAlert.swal({
               title: 'Sin Clientes',
               text: '¿Desea continuar guardando la ruta sin PDVs?',
               type: 'warning',
               showCancelButton: true,
               confirmButtonText: 'Continuar',
               closeOnConfirm: false,
               closeOnCancel: false,
            }, function(isConfirm) {
               if (isConfirm) {
                  exito(true);
               } else {
                  error('No guardó sin clientes.');
               }
            });
         });
      }
      return $q.resolve(true);
   }

   $scope.guardar = function() {
      var rutaPreparada = prepararRuta($scope.ruta);
      validarRuta(rutaPreparada)
         .then(function() {
            return ruta.guardar(rutaPreparada);
         })
         .then(function() {
            //$scope.promotorChange();
            SweetAlert.success('Éxito', 'Guardado con éxito');
            $state.go("rutas");
         })
         .catch(function(err) {
            SweetAlert.error('Error', err || 'Favor de revisar los campos.');
         });
   };

   function obtenerRuta(idRuta) {
      $scope.pdvs = [];
      $scope.ruta = {
         Responsable: $scope.ruta.Responsable,
         DetalleRuta: $scope.pdvs,
      };
      ruta.ObtenerRutaPorID(idRuta)
         .then(function(resp) {
            if (resp.data.Datos && resp.data.Datos.Responsable) {
               var ruta = resp.data.Datos;
               var detalle = ruta.DetalleRuta;
               var clientes = {};
               detalle.forEach(function(d) {
                  var renglon = clientes[d.PDV.ID] || {
                     PDV: d.PDV,
                     dias: [2, 3, 4, 5, 6, 7, 1].map(function(d) {
                        return crearDia(d, 1, null, null);
                     }),
                     Frecuencia: d.Frecuencia,
                     SemanaPrimerVisita: moment(d.SemanaPrimerVisita).toDate(),
                  };

                  var primerVisita = moment(d.SemanaPrimerVisita).toDate();
                  if (primerVisita < renglon.SemanaPrimerVisita) {
                    renglon.SemanaPrimerVisita = primerVisita;
                  }

                  clientes[d.PDV.ID] = renglon;
                  renglon.dias.forEach(function(dia) {
                     if (dia.DiaSemana === d.DiaSemana) {
                        dia.OrdenVisita = d.OrdenVisita;
                     }
                  });

               });

               $scope.pdvs = Object.keys(clientes).map(function(id) {
                  return clientes[id];
               });
               ruta.DetalleRuta = $scope.pdvs;
               $scope.ruta = ruta;

               recalcularMarkers();
            }
         });
   };

});
