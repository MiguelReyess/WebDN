'use strict';

angular.module('dnwebApp')

    .config(function($stateProvider) {
        $stateProvider.state('reporte-historico-visitas', {
            url: '/reporte/visitas?fechaInicio&fechaFin&idPDV',
            templateUrl: 'views/reporte-historico-visitas.html',
            controller: 'ReporteHistoricoVisitasCtrl',
            cache: false,
            params: {}
        });
    })
    .controller('ReporteHistoricoVisitasCtrl', function($scope, catalogoGeneral, reporte, alertas, $state, uiGmapGoogleMapApi) {
        $scope.setTitle('Reporte de Visitas');
        var inicioDeMes = moment();
        inicioDeMes.date(1);
        $scope.inicio = inicioDeMes.toDate();
        $scope.fin = moment().toDate();
        $scope.visitas = [];

        if($state.params.fechaInicio && $state.params.fechaFin && $state.params.idPDV){
            buscar($state.params.fechaInicio, $state.params.fechaFin, $state.params.idPDV);
        }

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
        $scope.pdv = null;
        $scope.map = {
            center: {
               latitude: 25.7,
               longitude: -100.4,
            },
            zoom: 12,
            markers: [],
            path: [],
            options: {
               scrollwheel: true,
            },
            control: {},
         };

        catalogoGeneral.obtenerCadenas()
            .then(function(cadenas) {
                $scope.cadenas = cadenas;
            });

        $scope.buscarCliente = function(texto) {
            return catalogoGeneral.buscarCliente(texto, $scope.cadena && $scope.cadena.ID);
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

        function colocarParametroRuta(fechaInicio, fechaFin, idPDV) {
            $state.transitionTo($state.current.name, {
               fechaInicio: fechaInicio,
               fechaFin: fechaFin,
               idPDV: idPDV,
            }, {
               notify: false
            });
         }

        $scope.buscar = function () {
            if($scope.pdv) {
                colocarParametroRuta(moment($scope.inicio).format('YYYY-MM-DD'), moment($scope.fin).format('YYYY-MM-DD'), $scope.pdv.ID);
                buscar(moment($scope.inicio).format('YYYY-MM-DD'), moment($scope.fin).format('YYYY-MM-DD'), $scope.pdv.ID);
            } else {
                alertas.advertencia('Búsqueda', 'Favor de seleccionar un PDV');
            }
        };

        function buscar(fechaInicio, fechaFin, idPDV) {
            reporte.reporteHistoricoVisitasPorPDV(fechaInicio, fechaFin, idPDV)
                .then(function(data) {
                    if(!data.length){
                        $scope.visitas = [];
                        alertas.advertencia('Búsqueda', 'Sin resultados');
                        return;
                    }
                    $scope.visitas = data || [];
                    $scope.visitas.forEach(function(visita) {
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

                        if (visita.Latitud && visita.Longitud) {
                            visita.coords = {
                                latitude: visita.Latitud,
                                longitude: visita.Longitud,
                            };
                        }
                        visita.icon = 'images/marker_green.png';
                    });
                    $scope.map.center = {
                        latitude: $scope.visitas[0].coords ? $scope.visitas[0].coords.latitude : 0,
                        longitude: $scope.visitas[0].coords ? $scope.visitas[0].coords.longitude : 0
                    };

                    $scope.map.markers = [$scope.visitas[0]];

                    setTimeout(function() {
                        if ($scope.map.control.refresh) {
                            $scope.map.control.refresh();
                        }
                    }, 1000);
                })
                .catch(function(err){
                    alertas.advertencia('Búsqueda', 'Ocurrió un error al obtener el reporte');
                });
        }

        $scope.abrirDetalle = function(visita) {
            $state.go('detalle-visita', {
               idVisita: visita.ID
            });
        };
    });
