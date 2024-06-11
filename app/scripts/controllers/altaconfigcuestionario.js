"use strict";

/**
 * @ngdoc function
 * @name dnwebApp.controller:AltaconfigcuestionarioCtrl
 * @description
 * # AltaconfigcuestionarioCtrl
 * Controller of the dnwebApp
 */
angular
    .module("dnwebApp")
    .controller(
        "AltaConfigCuestionarioCtrl",
        function (
            $scope,
            $log,
            $timeout,
            Upload,
            catalogoGeneral,
            configuracionCuestionario,
            SweetAlert
        ) {
            $scope.puestosRequeridos = [
                "Asesor Comercial",
                "Promotor",
                "Gerente Canal",
                "OPV",
            ];
            // $scope.puestosRequeridos2 = ['Asesor Comercial'];
            $scope.setTitle("Configuración de Cuestionarios");

            $scope.cargandoArchivo = false;
            $scope.buenos = null;

            function configVacia() {
                return {
                    ID: null,
                    TipoCuestionario: null,
                    FechaInicio: null,
                    FechaFin: null,
                    Cuestionario: null,
                    Titulo: null,
                    DescCorta: null,
                    Codigo: null,
                    ForzarGuardado: null,
                    PDVsAsignados: null,
                    PuestosAplica: null,
                };
            }

            catalogoGeneral.obtenerTiposCuestionario().then(function (tipos) {
                $scope.tiposCuestionario = tipos;
            });

            catalogoGeneral
                .obtenerCuestionarios()
                .then(function (cuestionarios) {
                    $scope.cuestionarios = cuestionarios;
                });

            catalogoGeneral.obtenerPuestos().then(function (puestos) {
                $scope.puestos = puestos;
                $scope.nuevosPuestos = $scope.puestos.filter((p) => $scope.puestosRequeridos.includes(p.Descripcion) );
            });

            $scope.configuracion = configVacia();

            $scope.pdvsResultado = [
                {
                    DescCorta: "Soriana",
                },
                {
                    DescCorta: "HEB",
                },
            ];

            $scope.cambiaCuestionario = function () {
                $scope.configuracion.Titulo =
                    $scope.configuracion.Cuestionario.Titulo;
                $scope.configuracion.DescCorta =
                    $scope.configuracion.Cuestionario.DescCorta;
                $scope.configuracion.TipoCuestionario =
                    $scope.configuracion.Cuestionario.TipoCuestionario;
            };

            $scope.cargarArchivo = function (archivo) {
                if (!archivo) {
                    return;
                }
                $scope.cargandoArchivo = true;
                $scope.malos = null;
                $scope.buenos = null;
                $scope.repetidos = null;

                configuracionCuestionario
                    .subirCSV(archivo)
                    .then(function (resp) {
                        var datos = resp.data.Datos;
                        if (datos.Malos.length) {
                            $scope.malos = datos.Malos;
                        } else if (datos.Buenos.length) {
                            var repetidos = datos.Buenos.slice(0)
                                .sort()
                                .reduce(function (accum, elt, indice, arr) {
                                    var last = accum[accum.length - 1];
                                    if (
                                        elt === arr[indice - 1] &&
                                        elt !== last
                                    ) {
                                        accum.push(elt);
                                    }
                                    return accum;
                                }, []);
                            if (repetidos.length) {
                                SweetAlert.error(
                                    "Error",
                                    "Codigos duplicados."
                                );
                                $scope.repetidos = repetidos;
                            } else {
                                $scope.buenos = datos.Buenos;
                            }
                        }
                    })
                    .catch(function () {
                        SweetAlert.error(
                            "Error",
                            "El archivo no se pudo procesar."
                        );
                    })
                    .finally(function () {
                        $scope.cargandoArchivo = false;
                        $log.info("cargando false");
                    });
            };

            $scope.guardar = function () {
               var asesor = $scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Asesor Comercial");
               var gerente = $scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Gerente Canal");
               if (asesor.length) {
                 var vendedorJr = {
                   ID: 14,
                   Descripcion: "Vendedor JR",
                 };
                 if (!$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion === "Vendedor JR").length) 
                 {
                   $scope.configuracion.PuestosAplica.push(vendedorJr);
                 }
               } else {
                 $scope.configuracion.PuestosAplica =$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion !== "Vendedor JR" );
               }
               if (gerente.length) {
                 var gerenteZona = {
                   ID: 12,
                   Descripcion: "Gerente Zona",
                 };
         
                 if (!$scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Gerente Zona").length) {
                     $scope.configuracion.PuestosAplica.push(gerenteZona);
                 }
               } else {
                 $scope.configuracion.PuestosAplica =$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion !== "Gerente Zona");
               }

                if (!$scope.buenos || $scope.buenos.length === 0) {
                   SweetAlert.error('Validación',
                      'Favor de enviar el archivo con PDVs para el cuestionario.');
                } else {
                   $scope.configuracion.PDVsAsignados = $scope.buenos.map(function (elt) {
                      return {
                         ID: elt,
                      };
                   });

                   configuracionCuestionario.guardar($scope.configuracion)
                      .then(function () {
                         SweetAlert.success('Éxito',
                            'Se ha guardado la configuración exitosamente.');
                         $scope.limpiar();
                      })
                      .catch(function (err) {
                         if (err.status === 409) {
                            // Intentar ForzarGuardado
                            SweetAlert.swal({
                               title: 'Configuración Existente',
                               text: 'Ya existe una configuración con ese código para este cuestionario. ¿Desea crear una nueva?',
                               type: 'warning',
                               showCancelButton: true,
                               confirmButtonText: 'Aceptar',
                               cancelButtonText: 'Cancelar',
                               closeOnConfirm: true,
                            }, function (isConfirm) {
                               if (isConfirm) {
                                  $scope.configuracion.ForzarGuardado = true;
                                  $scope.guardar();
                               }
                            });
                            return;
                         }
                         if (err.data && err.data.Datos) {
                            err = err.Mensaje;
                         }
                         if (!angular.isString(err)) {
                            err = '';
                         }
                         SweetAlert.error('Error', 'No se ha podido guardar la configuración.\n' +
                            err);
                      });
                }
            };

            $scope.limpiar = function () {
                $scope.configuracion = configVacia();
                $scope.buenos = null;
                $scope.malos = null;
            };

            $scope.agregarPDV = function (pdv) {
                // console.log(pdv);
            };

            $scope.seleccionaIDs = function (ids) {
                if (angular.isArray(ids) === false) {
                    ids = [ids.ID];
                }
                $scope.buenos = $scope.buenos || [];
                $scope.buenos = _.uniq($scope.buenos.concat(ids));
            };
        }
    );
