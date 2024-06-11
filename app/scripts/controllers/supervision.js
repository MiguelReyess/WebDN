'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:SupervisionCtrl
 * @description
 * # SupervisionCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
    .controller('SupervisionCtrl',
        function($scope, visita, $state, ruta) {
            $scope.setTitle('Equipo de Trabajo');
            $scope.rutas = [];

            ruta.obtenerRutas()
                .then(function(rutas) {
                    $scope.rutas = rutas;
                    kendoGrid($scope.rutas);
                });

            $scope.verRuta = function(ID, ResponsableID) {
                $scope.rutas;
                $state.go('supervision.supervision-usuario', {
                    idUsuario: ID,
                    idRuta: ResponsableID,
                });
            };

            function kendoGrid(ruta) {
                $scope.$evalAsync(function() {
                    var grid = $("#gridListadoRutas");
                    grid.data('kendoGrid').setOptions({

                        dataSource: { data: ruta, pageSize: 15 },
                        sortable: true,
                        resizable: true,
                        editable: false,
                        scrollable: true,
                        filterable: true,
                        reorderable: true,
                        columnMenu: true,
                        //pageable: true,
                        pageable: {
                            refresh: false,
                            pageSizes: true,
                            buttonCount: 5
                        },

                        columns: [{
                                //width:"25%",
                                title: "Ruta",
                                field: "DescCorta",
                                filterable: true,
                                hidden: false
                            },
                            {
                                //width: "50%",
                                title: "Usuario",
                                field: "Responsable.Usuario",
                                filterable: true,

                            },
                            {
                                //width: "50%",
                                title: "Nombre",
                                field: "Responsable.Nombre + ' ' + Responsable.ApellidoPaterno",
                                filterable: true,

                            },
                            {
                                //width: "50%",
                                title: "RutaID",
                                field: "ID",
                                filterable: true,
                                hidden: true,

                            },
                            {
                                //width: "50%",
                                title: "NombreID",
                                field: "Responsable.ID",
                                filterable: true,
                                hidden: true,

                            },
                           
                            {
                                filterable: false,
                                width: "100px",
                                title: "Detalle",
                               // field: "Acciones",
                                attributes: { "class": "text-center" },
                                //template: ObtenerBotones,menu:false,
                                sortable: false,
                                resizable: false,
                                editable: false,
                                scrollable: false,
                                filterable: false,
                                reorderable: false,
                                template: '<button class="btn btn-primary btn-xs" ng-click="verRuta(#=ID#, #=Responsable.ID#)"><i class="fa fa-eye"></i></button>'

                            }
                        ]
                    });
                });
            }

        }
    );