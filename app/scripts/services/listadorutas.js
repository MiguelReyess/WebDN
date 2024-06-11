'use strict';

angular.module('dnwebApp')
	.service('ListadoRutas',function($q, $http, configuracion){

		var url = configuracion.DireccionActiva;

		this.obtenerListadoRutas = function(estaActivo){

			return $http.get(url + 'Ruta/Listado/Activo/' + estaActivo)
			.then(function(resp){
				return resp.data.Datos;
			})
			.catch(function(err)
			{
				throw err.data.Mensaje;
			});
		}

	});