	'use strict';

	angular.module('dnwebApp')

	.controller('ReporteJustificacionesCrtl',function($scope,$timeout,$q,catalogoGeneral,SweetAlert,moment,reporte){

		var total = 0;
		var itemsPorPagina = 10;
		var nombreArchivo = null;

		catalogoGeneral.obtenerFuncionales()
		.then(function(usuarios) {
		 $scope.usuarios = usuarios;
		// $scope.usuario = usuarios[0];
		});

		$scope.buscar = function()
		{
			if(($scope.inicio !== "" && $scope.inicio != null) && ($scope.fin !== "" && $scope.fin != null))
			{
				if($scope.inicio <= $scope.fin)
				{
					/*var objfiltros = {
						FechaInicio:$scope.inicio,
						FechaFin:$scope.fin,
						UsuarioID:$scope.usuario.ID
					};
					reporte.obtenerJustificaciones(objfiltros).then(function(resp){

					})
					.catch(function(err){
						SweetAlert.warning(err);
					});*/
					mostrarDatosGrid();
				}
				else
				{
					SweetAlert.warning("Aviso","La fecha de Inicio debe ser menor a la fecha fin");
				}
			}
			else
			{
				SweetAlert.warning("Aviso","Se debe seleccionar una fecha de inicio y fecha fin");
			}
		}

		function mostrarDatosGrid()
		{
			$('#gridJustificaciones').data('kendoGrid').setOptions({
			    
			    columns: columnas,
			    scrollable: true,
			    resizable: true,
			    dataSource: dataSource,
			    toolbar: toolbar,
			    // sortable: true,
			    excel: {
			       allPages: true,
			    },
			    excelExport: function(e) {
			       e.workbook.fileName = nombreArchivo;
			       swal.close();
			    },
			    pageable: {
			       pageSizes: [5, 10, 20, 100],
			       pageSize: itemsPorPagina,
			    },
			    dataBound: dataBound,
			});

			$("#gridJustificaciones").find('#exportarExcel').kendoButton({

				click:function(){
					var nombreDefault ='Reporte Motivos Justificacion';
					SweetAlert.swal({
							title: 'Exportar',
							text: 'Escriba el nombre del archivo',
							type: 'input',
							showCancelButton: true,
							inputValue: nombreDefault,
							showLoaderOnConfirm: true,
							closeOnConfirm: false,
						},function(nombre){
						if (nombre === false) {
	                     	return;
		                }
		                if (!nombre || nombre.trim() === '') {
		                     nombre = nombreDefault;
		                }
		                nombre += '.xlsx';
		                nombreArchivo = nombre;
		                $('#gridJustificaciones').data('kendoGrid').saveAsExcel();
					});
				}
			});

		}

		//elementos del grid
		var dataSource ={
		  	
		  	transport:{
		  		read:function(options){
		      		var inicio = $scope.inicio || null;
		            var fin = $scope.fin || null;
		            var usuario =  $scope.usuario.ID;

		            reporte.obtenerJustificaciones(options.data.page, options.data.pageSize, inicio, fin, usuario)
		            	.then(function(datos){
		            	 total = datos.TotalRegistros || total;
		            	 if(total > 0)
		            	 {
							 if(options.data.page === 1)
							 {
		            	 		SweetAlert.success("Exito","Información encontrada con exito");
							 }
		            	 }
		            	 else
		            	 {
		            	 	SweetAlert.warning("Aviso","No se encontro información con los datos proporcionados");
		            	 }
		            	 datos.Reporte.forEach(function(registro){

		            	 });
		            	 options.success(datos);
						})
		            .catch(function(){
		            	options.err('No se ha podido ejecutar la consulta');
		            });

		  		},
		  	},
		  	schema:{
		  		total: function(){
		  			return total;
		  		},
		  		data:'Reporte',
		  		parse:function(datos){
		  			return datos;
		  		},
		  	},
		  	serverPaging: true,
	      	serverSorting: true,

		};


		var columnas =
		[
		  {
		  	title:'Ruta',
		  	field:'Ruta'
		  },
		  {
		  	title:'Nombre',
		  	field:'Nombre'
		  },
		  {
		  	title:'Tienda',
		  	field:'Tienda'
		  },
		  {
		  	title:'Justificación',
		  	field:'MotivoJustificacion'
		  },
		  {
		  	title:'Fecha Inicio',
		  	field:'FechaInicio',
		  	type:"date",
		  	format: "{0:dd/MM/yyyy}"
		  },
		  {
		  	title:'Fecha Fin',
		  	field:'FechaFin',
		  	type:"date",
		  	format: "{0:dd/MM/yyyy}"
		  },
		  {
		  	title:'Comentarios',
		  	field:'Comentarios'
		  },
		  {
		  	title:'Gerente Canal',
		  	field:'GerenteCanal'
		  },
		  {
		  	title:'Asesor Comercial',
		  	field:'AsesorComercial'
		  },
		  {
		  	title:'Ciudad',
		  	field:'Ciudad'
		  },
		  {
		  	title:'Zona Nielsen',
		  	field:'ZonaNIELSEN'
		  },
		  {
		  	title:'Zona Iscam',
		  	field:'ZonaISCAM'
		  },
		  {
		  	title:'Canal',
		  	field:'Canal'
		  },
		  {
		  	title:'Tipo PDV',
		  	field:'TipoPDV'
		  },
		  {
		  	title:'Segmento PDV',
		  	field:'NombreSegmento'
		  },
		  {
		  	title:'Cadena',
		  	field:'Cadena'
		  },
		  {
		  	title:'Usuario',
		  	field:'Usuario'
		  }
		];

		var toolbar = 
		[
			{
				template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
			}
	   	];

	   	function dataBound(){

	   		$scope.$evalAsync(function() {
	         var grid = $('#gridJustificaciones').data('kendoGrid');
	         grid.columns.forEach(function(e, i) {
	            grid.autoFitColumn(i);
	         });
	      });
	   	}



	});