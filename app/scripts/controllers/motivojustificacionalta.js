'use strict';

angular.module('dnwebApp')
	.controller('MotivoJustificacionAltaCtrl',['$scope','$state','SweetAlert','$timeout','$uibModal','alertas', '$window','MotivoJustificacionesAlta','catalogoGeneral',
		function($scope,$state,SweetAlert,$timeout, $uibModal,alertas, $window,MotivoJustificacionesAlta,catalogoGeneral){

			$scope.datos={};
			$scope.motivoJustificaciones = [];
			$scope.clientes=[];
			$scope.pdvs = null;
			$scope.fechaInicio = "";
			$scope.fechaFin = "";

			$scope.obtenerCatalogoJustificaciones = obtenerCatalogoJustificaciones();


			//cargar catalogos de PDV
			catalogoGeneral.obtenerMisClientes()
	         .then(function(clientes) {

	         	if(clientes.length > 0)
	         	{
	            	$scope.clientes = clientes;
	         	}
	         	else
	         	{
	         		SweetAlert.warning("El usuario no cuenta con PDVS");
	         	}
	         });

			function obtenerCatalogoJustificaciones()
			{
				MotivoJustificacionesAlta.obtenerCatalogoJustificaciones().then(function(resp){

					$scope.motivoJustificaciones = resp;
				})
				.catch(function(err){
					console.log(err);
					SweetAlert.error(err);
				});
			}

			$scope.guardar = function()
			{
				
				if(($scope.fechaInicio !== "" && $scope.fechaInicio !== null) && ($scope.fechaFin != "" && $scope.fechaFin !== null))
				{
					if($scope.fechaInicio < $scope.fechaFin)
					{
						var objNuevaJustificacion = 
						{
							FechaInicio: $scope.fechaInicio,
							FechaFin: $scope.fechaFin,
							Motivos: $scope.tipoMotivoJustificacion,
							IDPDV :$scope.PDV.ID,
							Comentarios:$scope.comentarios,
						};

						MotivoJustificacionesAlta.guardarJustificaciones(objNuevaJustificacion).then(function(){

							SweetAlert.success("Justificacion Guardada correctamente");
							$state.go('justificaciones');
						})
						.catch(function(err)
						{
							console.log(err);
							SweetAlert.error(err);
						});
					}
					else
					{
						SweetAlert.warning("La fecha de Inicio debe ser menor a la fecha fin.");
					}
				}
				else
				{
					SweetAlert.warning("Se requiere de una fecha de inicio y una fecha fin");
				}
			}

			$scope.filtroAgregarCliente = function(cliente) {
			
				 return !$scope.pdvs || $scope.pdvs.every(function(visita) {
				    return visita.PDV.ID !== cliente.ID;
				 });

			};
		}
	]);