'use strict';

angular.module('dnwebApp')
	.service('justificacionesServices',['$q', '$http', 'configuracion',
		function($q,$http,configuracion){

			var url = configuracion.DireccionActiva;


			this.obtenerJustificaciones = function(){

				var URL = url + 'Cuestionario/Justificacion';
				return $http.get(URL)
				.then(function(resp){
					return $q.when(resp.data.Datos);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}

			this.EliminarRegistroSeleccionado = function(ID){

				var URL = url + 'Cuestionario/Justificacion/IDJustificacion/'+ ID;
				return $http.get(URL)
				.then(function(resp){
					return $q.when(resp.data);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}

			this.obtenerCatalogoJustificaciones = function(){

				var URL = url + 'Catalogo/MotivoJustificacion?esWeb=true';
				return  $http.get(URL)
				.then(function(resp){
					return $q.when(resp.data.Datos);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}
			this.guardarJustificaciones = function(objNuevaJustificacion){

				var URL = url + 'Cuestionario/Justificacion/AplicarJustificacion';
				return  $http.post(URL,objNuevaJustificacion)
				.then(function(resp){
					return $q.when(resp.data);
				})
				.catch(function(err){
					return $q.reject(err.data);
				});
			}

		}
	]);