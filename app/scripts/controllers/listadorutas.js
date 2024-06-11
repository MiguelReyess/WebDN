'use strict';

angular.module('dnwebApp')
.controller('ListadoRutasCtrl',function($scope,$timeout,SweetAlert,moment,$state,ruta){

	$scope.obtenerListado = obtenerListado();

	function obtenerListado()
	{
		var estaActivo = true;
		
		var arryListadoRutas = [];
		ruta.obtenerListadoRutas(estaActivo).then(function(resp){

			if(resp.length > 0)
			{
				for(var i=0; i < resp.length; i++)
				{
					var objListadoRutas={};
					objListadoRutas.ID = resp[i].ID;
					objListadoRutas.Descripcion = resp[i].Descripcion;
					objListadoRutas.Nombre = resp[i].Nombre;
					objListadoRutas.Responsable = resp[i].Responsable.Nombre;

					arryListadoRutas.push(objListadoRutas);
				}
				cargarInformacionGrid(arryListadoRutas);
			}
			else
			{
				SweetAlert.warning('Aviso', 'No se encontraron registros con el usuario que inicio sesión');
			}
		})
		.catch(function(err)
		{
			console.log(err);
		});
	}

	$scope.verDetalle = function(idRuta)
	{
		
		$state.go(".editar",{idruta:idRuta});
	};

	$scope.nuevo = function(){
		$state.go(".nueva");
	};

	function cargarInformacionGrid(dataSource)
	{
		$scope.$evalAsync(function() {
			var grid = $("#gridListadoRutas");
			grid.data('kendoGrid').setOptions({
	       
			        dataSource: { data: dataSource, pageSize: 20 },
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
			        columns: [
			                    {
			                        //width:"25%",
			                        title: "ID",
			                        field: "ID",
			                        filterable: true,
			                        hidden:true
			                    },
			                    {
			                        //width: "50%",
			                        title: "Nombre",
			                        field: "Nombre",
			                        filterable: true,

			                    },
			                    {
			                        //width: "50%",
			                        title: "Descripción",
			                        field: "Descripcion",
			                        filterable: true,

			                    },
			                    {
			                    	title: "Responsable",
			                        field: "Responsable",
			                        filterable: true,
			                        hidden:false
			                    },
			                    {
			                        filterable: false,
			                        width: "100px",
			                        title: "Acciones",
			                        field: "Acciones",
			                        attributes: { "class": "text-center" },
			                        //template: ObtenerBotones,menu:false,
			                        sortable: false,
			                        resizable: false,
			                        editable: false,
			                        scrollable: false,
			                        reorderable: false,
			                        template:'<button class="btn btn-primary btn-xs" ng-click="verDetalle(#=ID#)"><i class="fa fa-pencil"></i></button>'
			                        
			                    }
			        ]
			});
		});
	}

});