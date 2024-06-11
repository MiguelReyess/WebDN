'use strict';

angular.module('dnwebApp')
	.service('indicadoresoperativosServices',['$q', '$http', 'configuracion',
		function($q,$http,configuracion){

			var url = configuracion.DireccionActiva;

			this.ObtenerIndicadoresRuta = function(usuario){
				var params = {
					usuario : usuario
				};
				var URL = url + 'Indicadores/usuarioRutas';
				return $http.get(URL, { params: params })
				.then(function(resp){
					return $q.when(resp.data);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}

			this.ObtenerIndicadoresGenerales = function(usuario){
				var params = {
					usuario : usuario
				};

				var URL = url + 'Indicadores/usuarioGenerales';
				return $http.get(URL, { params: params })
				.then(function(resp){
					return $q.when(resp.data);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}
		}
	]);