'use strict';

angular.module('dnwebApp')
	.controller('JustificacionesCtrl',['$scope','$state','MotivoJustificaciones','SweetAlert',
		function($scope,$state,MotivoJustificaciones,SweetAlert){

			$scope.listadoJustificaciones = [];
			$scope.obtenerJustificaciones = obtenerJustificaciones();

			function obtenerJustificaciones()
			{
				
				MotivoJustificaciones.obtenerJustificaciones().then(function(resp){

					$scope.listadoJustificaciones = resp;
					if($scope.listadoJustificaciones)
					{

						cargarGridJustificaciones($scope.listadoJustificaciones);
					}
					else
					{
						SweetAlert.warning("No se encontraron registros con el usuario que se inicio sesión");
					}
				})
				.catch(function(err){
					console.log(err);
					SweetAlert.error(err);
				});
			}
			function cargarGridJustificaciones(dataListadoJustificaciones)
			{
				
				var grid = $("#gridListadoJustificaciones");
				grid.kendoGrid({

					dataSource:{
						data:dataListadoJustificaciones,
						pageSize:10
					},
					sortable: true,
			        //resizable: true,
			        editable: false,
			        scrollable: true,
			        filterable: false,
			        reorderable: true,
			        //columnMenu: true,
			        pageable: {
	                    refresh: true,
	                    pageSizes: [10,20,50],
	                    buttonCount: 20
                	},
			        selectable: true,
			        dataBound:function(e)
			        {
						$(".fa-trash").kendoTooltip({
						content: "Eliminar",
						position: "top"
						});
						$(".k-button").css('font-family', 'FontAwesome');
			        },
			        columns:
				        [
				        	{
				        		title: "ID",
		                        field: "ID",
		                        filterable: true,
		                        hidden:true
				        	},
				        	{
				        		title: "Descripción",
		                        field: "MotivoJustificacion",
		                        filterable: true
				        	},
				        	{
				        		title: "Fecha Inicio",
		                        field: "FechaInicio",
		                        filterable: true,
		                        type: "date",
		                        format: "{0:dd/MM/yyyy}"
				        	},
				        	{
				        		title: "Fecha Fin",
			                    field: "FechaFin",
			                    filterable: true,
			                    type: "date",
		                        format: "{0:dd/MM/yyyy}"
				        	},
				        	{
				        		title: "Comentarios",
		                        field: "Comentarios",
		                        filterable: true
				        	},
				        	{
				        		title: "Nombre",
		                        field: "PDVNombre",
		                        filterable: true
				        	},
				        	{
				        		title: "Usuario",
		                        field: "Usuario",
		                        filterable: true
				        	},
				        	{
				        		filterable: false,
		                        width: "100px",
		                        title: "Acciones",
		                        field: "Acciones",
		                        attributes: { "class": "text-center" },
		                        //template: ObtenerBotones(dataListadoJustificaciones),
		                        menu:false,
		                        sortable: false,
		                        resizable: false,
		                        editable: false,
		                        scrollable: false,
		                        filterable: false,
		                        reorderable: false,
		                        command:{
		                        	text:"Eliminar",
		                        	click:EliminarRegistro,
		                        	//template: ObtenerBotones(dataListadoJustificaciones)
		                        }
				        	}
				        ]
				});
			}
			/*function ObtenerBotones(obj)
			{
				return '<button data-id="' + obj.ID + '" class="btn btn-sm fa fa-trash  btnDeleter"> </button>';
			}*/
			function EliminarRegistro(e)
			{
				e.preventDefault();
				var registro = this.dataItem($(e.currentTarget).closest("tr"));
				
				MotivoJustificaciones.EliminarRegistroSeleccionado(registro.ID).then(function(resp){
					
					SweetAlert.success(resp.Mensaje);
					obtenerJustificaciones();
				})
				.catch(function(err)
				{
					console.log(err);
					SweetAlert.error(err);
				});
			}
			$scope.alta = function()
			{
				$state.go(".justificacionesalta");
			}
		}
	]);