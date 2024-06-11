'use strict';

angular.module('dnwebApp')
	.controller('JustificacionAltaCtrl', ['$scope', '$state', 'SweetAlert', '$timeout', '$uibModal', 'alertas', '$window', 'catalogoGeneral', 'justificacionesServices', 'usuario', 'ruta',
		function ($scope, $state, SweetAlert, $timeout, $uibModal, alertas, $window, catalogoGeneral, justificacionesServices, usuario, ruta) {

			$scope.datos = {};
			$scope.motivoJustificaciones = [];
			$scope.clientes = [];
			$scope.pdvs = null;
			$scope.rutas = null;
			$scope.fechaInicio = "";
			$scope.fechaFin = "";
			$scope.usuariosAsignados = [];
			$scope.porRuta = false;
			$scope.rutaSeleccionada = null;
			$scope.nombreRutaSeleccionada = "";
			$scope.nombreUsuarioSeleccionado = "";

			$scope.obtenerCatalogoJustificaciones = obtenerCatalogoJustificaciones();
			// $scope.usuariosAsignados = obtenerUsuariosAsignados();
			// console.log($scope.usuariosAsignados,"$scope.usuariosAsignados");
			catalogoGeneral.obtenerFuncionales().then(function (usuarios) {
				$scope.usuariosAsignados = usuarios;
				// $scope.usuario = usuarios[0];
			});


			//cargar catalogos de PDV
			catalogoGeneral.obtenerMisClientes()
				.then(function (clientes) {

					if (clientes.length > 0) {
						$scope.clientes = clientes;
					}
					else {
						SweetAlert.warning("El usuario no cuenta con PDVS");
					}
				});

			cargarRutas().then((rutasConCliente) => $scope.rutas = rutasConCliente)

			function cargarRutas() {
				return ruta.obtenerRutas().then(rutas => Promise.all(rutas.map(item => cargarClientes(item))))
			}

			function cargarClientes(ruta_) {
				var ID = ruta_.ID
				var Nombre = ruta_.Nombre
				var DescCorta = ruta_.DesCorta
				var Descripcion = ruta_.Descripcion
				return ruta.ObtenerRutaPorID(ID).then(resp => {
					var clientsObject = {}
					if (resp.data.Datos && resp.data.Datos.Responsable) {
						var { DetalleRuta } = resp.data.Datos;
						DetalleRuta.forEach(
							DR => {
								clientsObject["" + DR.PDV.ID] = {
									"ID": DR.PDV.ID,
									"Nombre": DR.PDV.Nombre
								}
							}
						)
					}

					var pdvs = Object.keys(clientsObject).map(ID_ => ({ "ID": ID_, "Nombre": clientsObject["" + ID_].Nombre, "rutaId": ID }))
					var result = {
						ID,
						Nombre,
						DescCorta,
						Descripcion,
						pdvs
					}
					return result
				})
			}

			function obtenerCatalogoJustificaciones() {
				justificacionesServices.obtenerCatalogoJustificaciones().then(function (resp) {

					$scope.motivoJustificaciones = resp;
				})
					.catch(function (err) {
						console.log(err);
						SweetAlert.error(err);
					});
			}

			$scope.guardar = function () {
				if (($scope.fechaInicio !== "" && $scope.fechaInicio !== null) && ($scope.fechaFin != "" && $scope.fechaFin !== null)) {
					if ($scope.fechaInicio <= $scope.fechaFin) {
						var objNuevaJustificacion =
						{
							"FechaInicio": $scope.fechaInicio,
							"FechaFin": $scope.fechaFin,
							"Motivos": $scope.tipoMotivoJustificacion,
							"Comentarios": $scope.comentarios,
							"Persona": $scope.usuario
						};

						let objNuevasJustificaciones = []

						if ($scope.porRuta) {
							objNuevasJustificaciones = $scope.rutaSeleccionada.pdvs.map(pdv => {
								var newPdv = Object.assign({}, objNuevaJustificacion, { "IDPDV": parseInt(pdv.ID) });
								return newPdv
							})
						} else {
							objNuevaJustificacion.IDPDV = Number($scope.PDV.ID)
							objNuevasJustificaciones.push(objNuevaJustificacion)
						}

						var justificaciones = objNuevasJustificaciones.map(onj => justificacionesServices.guardarJustificaciones(onj))
						Promise.allSettled(justificaciones)
							.then(results => {
								var successfulResults = results.filter(result => result.status === "fulfilled");

								var rejectedResults = results.filter(result => result.status === "rejected");

								if (rejectedResults.length === 0) {
									SweetAlert.success("Información Guardada correctamente");
									$state.go('justificaciones');
								} else {
									rejectedResults.map(result => SweetAlert.error(result.reason));
								}
							})
					}
					else {
						SweetAlert.warning("La fecha de Inicio debe ser menor a la fecha fin.");
					}
				}
				else {
					SweetAlert.warning("Se requiere de una fecha de inicio y una fecha fin");
				}
			}

			$scope.filtroAgregarCliente = function (cliente) {

				return !$scope.pdvs || $scope.pdvs.every(function (visita) {
					return visita.PDV.ID !== cliente.ID;
				});

			};

			function obtenerUsuariosAsignados() {
				usuario.obtenerPersonasACargo().then(function (resp) {

					$scope.usuariosAsignados = resp;
				});
			}

			$scope.selectEntity = function (ruta, usuario) {
				if (ruta) {
					var nombre = ruta.Nombre ? ruta.Nombre : ""
					var descCorta = ruta.DescCorta ? ruta.DesCorta : ""
					var descripcion = ruta.Descripcion ? ruta.Descripcion : ""
					$scope.nombreRutaSeleccionada = nombre + ' - ' + descCorta + ', ' + descripcion
					$scope.rutaSeleccionada = ruta
				}
				if (usuario) {
					var nombre1 = usuario.Nombre ? usuario.Nombre : ''
					var nombre2 = usuario.Nombre2 ? usuario.Nombre2 : ''
					var apellidoPaterno = usuario.ApellidoPaterno ? usuario.ApellidoPaterno : ''
					var apellidoMaterno = usuario.ApellidoMaterno ? usuario.ApellidoMaterno : ''
					$scope.nombreUsuarioSeleccionado = nombre1 + ' ' + nombre2 + ' ' + apellidoPaterno + ' ' + apellidoMaterno
					$scope.usuario = usuario
				}
			}

			$scope.inputValidation = function () {
				if (!$scope.nombreRutaSeleccionada) {
					$scope.rutaSeleccionada = null

				}

				if (!$scope.nombreUsuarioSeleccionado) {
					$scope.usuario = null
					$scope.usuariosAsignados = obtenerUsuariosAsignados();
				}
			}

		}
	]);