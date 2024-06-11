"use strict";

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvEditarCtrl
 * @description
 * # PdvEditarCtrl
 * Controller of the dnwebApp
 */
angular
    .module("dnwebApp")

    .config(function ($stateProvider) {
        $stateProvider.state("pdv-editar", {
            url: "/editar/pdv/:id",
            templateUrl: "views/altapdv.html",
            controller: "PdvEditarCtrl as vm",
            cache: false,
            loginRequired: true,
            resolve: {
                rPDV: function ($stateParams, pdv) {
                    if ($stateParams.id) {
                        return pdv.obtener($stateParams.id);
                    } else {
                        return null;
                    }
                },
            },
            params: {},
        });
    })

    .controller(
        "PdvEditarCtrl",
        function (
            $scope,
            $state,
            rPDV,
            catalogoGeneral,
            alertas,
            pdv,
            configuradorCapturaPdv,
            interceptorPersonificar,
            DNConfig
        ) {
            var vm = this;

            vm.pdv = rPDV;
            $scope.pdvEditar = Object.assign({}, rPDV);
            $scope.puestoJefeTradeMarqueting = "25";
            $scope.puestoSistemas = "2";
            $scope.setTitle("Editar PDV");
            configuradorCapturaPdv.configurar(vm);
            $scope.vm;
            var user =
                interceptorPersonificar.getUsuarioPersonificar() ||
                DNConfig.getUsuarioActivo();
            user.Label =
                (user.ID || "") +
                " " +
                user.Nombre +
                " " +
                user.Nombre2 +
                " " +
                user.ApellidoPaterno +
                " " +
                user.ApellidoMaterno;
            setTimeout(() => {
                if (vm && vm.Asesores) {
                    vm.Asesores.push(user);
                }
            }, 2000);

            $scope.selected = {};

            $scope.agregarEmpleadosAlArbol = function (empleados, empleadoId) {
                $scope.empleados = empleados;
                var empleadoActual = empleados.find((e) => e.ID === empleadoId);
                $scope.empleadoActual = empleadoActual;
                $scope.selected[$scope.empleadoActual.ID] = true;
                let idJefeNominal = empleadoActual.IDJefeNominal;
                var jerarquiaEmpleadosJefes = [];
                if (
                    !idJefeNominal ||
                    empleadoActual.IDPuesto ==
                        $scope.puestoJefeTradeMarqueting ||
                    empleadoActual.IDPuesto == $scope.puestoSistemas
                ) {
                    pdv.obtenerPersonas()
                        .then(function (res) {
                            $scope.selected[$scope.empleadoActual.ID] = false;
                            $scope.empleadoActual = null;
                            $scope.empleados = res.data;
                            $scope.puestosGerenciales = [
                                "Gerente Desarrollo de Canal",
                            ];
                            $scope.jerarquiaEmpleadosTodos =
                                $scope.empleados.filter((emp) =>
                                    $scope.puestosGerenciales.includes(
                                        emp.PuestoDescripcion
                                    )
                                );
                            console.log(
                                $scope.jerarquiaEmpleadosTodos,
                                "$scope.jerarquiaEmpleadosTodos"
                            );
                            for (var e of $scope.jerarquiaEmpleadosTodos) {
                                $scope.selected[e.ID] = false;
                            }
                        })
                        .catch(function (error) {
                            console.error("Error al obtener empleados:", error);
                        });
                } else {
                    while (idJefeNominal) {
                        var empleadoJefe = empleados.find(
                            (e) => e.ID === idJefeNominal
                        );
                        jerarquiaEmpleadosJefes.unshift(empleadoJefe);
                        $scope.selected[empleadoJefe.ID] = true;
                        idJefeNominal = empleadoJefe.IDJefeNominal;
                    }
                    var puestosDescripcionJefes = [
                        "Gerente Desarrollo de Canal",
                        "Jefe Operativo de Zona",
                        "Coordinador",
                    ];
                    $scope.jerarquiaEmpleados = jerarquiaEmpleadosJefes.filter(
                        (emp) =>
                            puestosDescripcionJefes.includes(
                                emp.PuestoDescripcion
                            )
                    );
                    $scope.jerarquiaEmpleados.push(empleadoActual);
                    var empleadosConMismoNivelDelEmpleadoActual =
                        empleados.filter(
                            (e) =>
                                e.level === empleadoActual.level &&
                                e.ID !== empleadoId
                        );
                    $scope.jerarquiaEmpleados.push(
                        ...empleadosConMismoNivelDelEmpleadoActual
                    );
                    //Por si queremos agregar subordinados
                    //  var subordinadosDelEmpleadoActual = empleados.filter(e => e.level === empleadoActual.level - 1 && e.IDJefeNominal === empleadoActual.ID)
                    //  $scope.jerarquiaEmpleados.push(...subordinadosDelEmpleadoActual)
                }
            };
            $scope.selectedPromotoresVendedorJr = {};
            $scope.algunAsesorComercialSeleccionado = false;
            $scope.algunVendedorJrSeleccionado = false;
            $scope.disableAll = false;
            $scope.jerarquiaEmpleados = [];
            $scope.jerarquiaEmpleadosTodos = [];
            $scope.ultimosEmpleadosIDsSeleccionados = [];
            $scope.nombreUltimosEmpleadosIDsSeleccionados = [];

            $scope.toggleAll = function (empleado, isSelected) {
                if ($scope.empleadoActual) {
                    if (!isSelected) {
                        $scope.jerarquiaEmpleados =
                            $scope.jerarquiaEmpleados.filter(
                                (e) => e.level >= empleado.level
                            );
                    } else {
                        var subordinadosDelEmpleadoActual =
                            $scope.empleados.filter(
                                (e) =>
                                    e.level === empleado.level - 1 &&
                                    e.IDJefeNominal === empleado.ID
                            );
                        $scope.jerarquiaEmpleados.push(
                            ...subordinadosDelEmpleadoActual
                        );
                    }
                } else {
                    if (!isSelected) {
                        deseleccionarEmpleadosSubordinados(empleado, empleado);
                        $scope.ultimosEmpleadosIDsSeleccionados.pop();
                        $scope.nombreUltimosEmpleadosIDsSeleccionados.pop();
                        var arrySize =
                            $scope.ultimosEmpleadosIDsSeleccionados.length;
                        switch (arrySize) {
                            case 0:
                                vm.pdv.Gerente = $scope.pdvEditar.Gerente;
                                break;
                            case 1:
                                vm.pdv.JefeOperacionComercial =
                                    $scope.pdvEditar.JefeOperacionComercial;
                                break;
                            case 2:
                                vm.pdv.Coordinador =
                                    $scope.pdvEditar.Coordinador;
                                break;
                            case 3:
                                vm.pdv.AsesorComercial =
                                    $scope.pdvEditar.AsesorComercial;

                                break;
                            default:
                                break;
                        }
                    } else {
                        var subordinadosDelEmpleadoActual =
                            obtenerSubordinadosDelEmpleadoActual(
                                $scope.empleados,
                                empleado
                            );
                        var empleadoSeleccionadoIndex =
                            $scope.jerarquiaEmpleadosTodos.findIndex(
                                (emp) => emp.ID === empleado.ID
                            );
                        $scope.jerarquiaEmpleadosTodos.splice(
                            empleadoSeleccionadoIndex + 1,
                            0,
                            ...subordinadosDelEmpleadoActual
                        );
                        $scope.ultimosEmpleadosIDsSeleccionados.push(
                            empleado.ID
                        );
                        $scope.nombreUltimosEmpleadosIDsSeleccionados.push(
                            empleado
                        );

                        $scope.nombreUltimosEmpleadosIDsSeleccionados.forEach(
                            (empleado) => {
                                switch (empleado.PuestoDescripcion) {
                                    case "Gerente Desarrollo de Canal":
                                        vm.pdv.Gerente = empleado;
                                        break;
                                    case "Coordinador":
                                        vm.pdv.Coordinador = empleado;
                                        break;
                                    case "Jefe Operativo de Zona":
                                        vm.pdv.JefeOperacionComercial =
                                            empleado;
                                        break;
                                    case "Asesor Comercial":
                                        vm.pdv.AsesorComercial = empleado;
                                        break;
                                    case "Vendedor Jr":
                                        vm.pdv.AsesorComercial = empleado;
                                        break;
                                }
                            }
                        );

                        console.log(vm.pdv);
                        console.log($scope.pdvEditar, "editar");

                        $scope.asesor = empleado;
                        // vm.pdv.AsesorComercial = empleado
                    }
                }
            };

            function deseleccionarEmpleadosSubordinados(
                empleadoSeleccionado,
                empleadoSeleccionadoBase
            ) {
                var subordinadosDelEmpleadoActual =
                    obtenerSubordinadosDelEmpleadoActual(
                        $scope.jerarquiaEmpleadosTodos,
                        empleadoSeleccionado
                    );
                if (subordinadosDelEmpleadoActual.length) {
                    return deseleccionarEmpleadosSubordinados(
                        subordinadosDelEmpleadoActual[0],
                        empleadoSeleccionadoBase
                    );
                } else {
                    if (empleadoSeleccionado.ID === empleadoSeleccionadoBase.ID)
                        return;
                    var empleadoSeleccionadoIndex =
                        $scope.jerarquiaEmpleadosTodos.findIndex(
                            (emp) => emp.ID === empleadoSeleccionado.ID
                        );
                    $scope.selected[empleadoSeleccionado.ID] = false;
                    $scope.jerarquiaEmpleadosTodos.splice(
                        empleadoSeleccionadoIndex,
                        1
                    );
                    return deseleccionarEmpleadosSubordinados(
                        empleadoSeleccionadoBase,
                        empleadoSeleccionadoBase
                    );
                }
            }

            $scope.obtenerJerarquiaPorPuestoDescripcion =
                obtenerJerarquiaPorPuestoDescripcion;
            $scope.isDisabled = isDisabled;

            function isDisabled(empleado) {
                var tieneEmpleadosSeleccionados =
                    $scope.ultimosEmpleadosIDsSeleccionados.length;
                if (tieneEmpleadosSeleccionados) {
                    var ultimoEmpleadoSeleccionado =
                        $scope.jerarquiaEmpleadosTodos.find(
                            (emp) =>
                                emp.ID ===
                                $scope.ultimosEmpleadosIDsSeleccionados[
                                    tieneEmpleadosSeleccionados - 1
                                ]
                        );
                    var subordinadosDelEmpleadoActual =
                        obtenerSubordinadosDelEmpleadoActual(
                            $scope.jerarquiaEmpleadosTodos,
                            ultimoEmpleadoSeleccionado
                        );
                    if (
                        ultimoEmpleadoSeleccionado.ID === empleado.ID ||
                        subordinadosDelEmpleadoActual.some(
                            (e) => e.ID === empleado.ID
                        )
                    ) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }

            function obtenerJerarquiaPorPuestoDescripcion(puestoDescripcion) {
                let jerarquiaEmpleado = -1;
                var jerarquias = {
                    6: ["Gerente Desarrollo de Canal"],
                    5: ["Jefe Operativo de Zona"],
                    4: ["Coordinador"],
                    3: ["Asesor Comercial", "Vendedor Jr"],
                    2: ["OPV"],
                };
                for (var key in jerarquias) {
                    if (Object.hasOwnProperty.call(jerarquias, key)) {
                        var element = jerarquias[key];
                        for (var j of element) {
                            if (j === puestoDescripcion) {
                                jerarquiaEmpleado = key;
                            }
                        }
                    }
                }
                return jerarquiaEmpleado;
            }

            function obtenerSubordinadosDelEmpleadoActual(empleados, empleado) {
                return empleados.filter((e) => {
                    let jerarquiaEmpleado =
                        obtenerJerarquiaPorPuestoDescripcion(
                            e.PuestoDescripcion
                        );
                    let jerarquiaEmpleadoSeleccionado =
                        obtenerJerarquiaPorPuestoDescripcion(
                            empleado.PuestoDescripcion
                        );
                    return (
                        e.IDJefeNominal === empleado.ID &&
                        Number(jerarquiaEmpleadoSeleccionado) - 1 ===
                            Number(jerarquiaEmpleado) &&
                        e.Activo
                    );
                });
            }

            vm.seleccionado = function (p) {
                vm.pdv = null;
                $state.go("pdv-editar", {
                    id: p.ID,
                });
            };
            if (vm.pdv) {
                vm.pdv.AsesorComercial["Label"] =
                    vm.pdv.AsesorComercial.Nombre +
                    " " +
                    vm.pdv.AsesorComercial.ApellidoPaterno +
                    " " +
                    vm.pdv.AsesorComercial.ApellidoMaterno;
                var activeUser =
                    user.ID == "16" || user.ID == "2248"
                        ? user
                        : vm.pdv.AsesorComercial;
                var userId = activeUser.ID;
                $scope.asesor =
                    user.ID == "16" || user.ID == "2248" ? null : true;
                var userName = activeUser.Usuario;

                pdv.obtenerPersonasAcargo(userId, userName)
                    .then(function (res) {
                        $scope.agregarEmpleadosAlArbol(res.data, userId);
                    })
                    .catch(function (error) {
                        console.error("Error al obtener empleados:", error);
                    });
            }

            vm.guardarPDV = function () {
                console.log("vm.pdv", vm.pdv);
                // if (vm.pdv) {
                //     pdv.actualizar(vm.pdv)
                //         .then(function () {
                //             return alertas.exito('Guardado', 'Cambios a PDV guardados.');
                //         })
                //         .then(function () {
                //             $state.go('pdv-editar', {
                //                id: null
                //            });
                //         })
                //         .catch(function (err) {
                //             return alertas.error('Error', err.Mensaje);
                //         });
                // }
            };
        }
    );
