'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteImagenesCtrl
 * @description
 * # ReporteImagenesCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

    .config(function($stateProvider) {
        $stateProvider.state('reporte-imagenes', {
            url: '/reporte/imagenes',
            templateUrl: 'views/reporte-imagenes.html',
            controller: 'ReporteImagenesCtrl',
            cache: false,
            params: {}
        });
    })
    .controller('ReporteImagenesCtrl', function($scope, catalogoGeneral, reporte, producto, imagenes, pagerService, alertas) {

        $scope.setTitle('Reporte de Imágenes');

        var inicioDeMes = moment();
        inicioDeMes.date(1);
        $scope.inicio = inicioDeMes.toDate();
        $scope.fin = moment().toDate();

        $scope.pager = {};
        $scope.pageSize = 36;
        $scope.setPage = setPage;

        catalogoGeneral.obtenerCuestionariosEvidencia()
            .then(function(cuestionarios) {
                $scope.cuestionarios = cuestionarios;
            });

        producto.obtenerProductosMarcas()
            .then(function(marcas) {
                $scope.marcas = marcas;
            });

        catalogoGeneral.obtenerFuncionales()
            .then(function(usuarios) {
                $scope.usuarios = usuarios;
            });

        catalogoGeneral.obtenerCadenas()
            .then(function(cadenas) {
                $scope.cadenas = cadenas;
            });

        $scope.crearDataUrl = function(contenido) {
            if (contenido) {
                return 'data:image/png;base64,' + contenido;
            } else {
                return '';
            }
        };

        $scope.buscarCliente = function(texto) {
            return catalogoGeneral.buscarCliente(texto, $scope.cadena && $scope.cadena.ID);
        };

        $scope.buscar = function() {
            if (validarFormulario()) {
                var idCuestionario = $scope.cuestionario ? $scope.cuestionario.ID : null;
                var idMarca = $scope.marca ? $scope.marca.ID : null;
                var idUsuario = $scope.usuario ? $scope.usuario.ID : null;
                var idCadena = $scope.cadena ? $scope.cadena.ID : null;
                var idPDV = $scope.pdv ? $scope.pdv.ID : null;

                $scope.items = null;
                $scope.imagenes = null;
                $scope.buscando = true;
                reporte.imagenes($scope.inicio, $scope.fin, idCuestionario, idMarca, idUsuario, idCadena, idPDV)
                    .then(function(resp) {
                        $scope.buscando = false;
                        if (resp && resp.length > 0) {
                            $scope.items = resp;
                            $scope.setPage(1);
                        } else {
                            $scope.items = null;
                            alertas.advertencia('Búsqueda', 'No se encontraron coincidencias');
                        }
                    })
                    .catch(function(error) {
                        $scope.items = null;
                        $scope.buscando = false;
                        alertas.error('Error', 'No se encontrarón registros');
                    });
            }
        }

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages)
                return;
            // get pager object from service
            $scope.pager = pagerService.GetPager($scope.items.length, page, $scope.pageSize);
            // get current page of items
            $scope.imagenes = $scope.items.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }

        function validarFormulario() {
            var mensaje;
            if ($scope.inicio === null || !$scope.inicio) {
                mensaje = 'No se capturó la fecha de inicio.';
            } else if ($scope.fin === null || !$scope.fin) {
                mensaje = 'No se capturó la fecha de fin.';
            } else if ($scope.inicio > $scope.fin) {
                mensaje = 'La fecha de fin debe ser posterior a la fecha de inicio.';
                alertas.advertencia('Validación', mensaje);
            } else
                return true;
            return false;
        }
    });
