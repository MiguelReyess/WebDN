'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.autenticacion
 * @description
 * # autenticacion
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('autenticacion',
   function($rootScope, configuracion, $window, $q, $http, $log, loading,
      $interval, DNConfig, interceptorPersonificar) {

      var ip = configuracion.DireccionActiva;

      this.isLogged = function() {
         var islogged = $window.localStorage.getObject('islogged');

         return islogged === null ? false : islogged;
      };

      this.isPersonificar = function () {
         return angular.isObject(interceptorPersonificar.getUsuarioPersonificar());
      };

      this.signIn = function(user, pass) {
         interceptorPersonificar.setUsuarioPersonificar(null);
         return $q(function(resolve, reject) {
            var idSistema = configuracion.IDSistema;

            var login = {
               Usuario: user,
               Password: pass,
               IDSistema: idSistema
            };

            $http.post(ip + 'Usuario/IniciarSesion', login)
               .then(function(resp) {

                  $window.localStorage.setObject('loginHeaders', {
                     token: resp.data.Token,
                     user: login.Usuario,
                     idsistema: idSistema
                  });

                  $window.localStorage.setObject('islogged', true);

                  $http.defaults.headers.common = {
                     user: login.Usuario,
                     token: resp.data.Token,
                     idsistema: idSistema
                  };

                  resp.data.Datos.NombreCompleto = resp.data.Datos.Nombre + ' ' + resp.data.Datos.ApellidoPaterno;

                  DNConfig.setUsuarioActivo(resp.data.Datos);

                  resolve(resp.data.Datos);

               })
               .catch(function(err) {
                  if (err.status < 0) {
                     reject('Sin conexion a los servicios.', err.status);
                  } else {
                     $log.info(err);
                     reject(err.data.Mensaje, err.status);
                  }
               });

         });
      };

      this.signOut = function() {
         interceptorPersonificar.setUsuarioPersonificar(null);
         return $http.post(ip + 'Usuario/CerrarSesion')
            .then(function() {
               $window.localStorage.setObject('islogged', false);
               DNConfig.setUsuarioActivo(null);
            })
            .catch(function(err) {
               if (err.status === 401) {
                  $window.localStorage.setObject('islogged', false);
               } else {
                  $log.info(err.data.MensajeTecnico);
                  return $q.reject(err.data.Mensaje, err.status);
               }
            });
      };

      this.getLoginHeaders = function() {
         return $window.localStorage.getObject('loginHeaders');
      };

      this.checkAutoKeepAlive = function(miliseconds, callback) {
         callback = typeof miliseconds === 'function' ? miliseconds : undefined;

         miliseconds = typeof miliseconds === 'number' ? miliseconds : 60000;

         var check = function() {
            loading.preventOne();
            $http.get(ip + 'Usuario/ValidarSesionActiva', {
                  ignoreLoadingBar: true
               }).then(function() {
                  $window.localStorage.setObject('islogged', true);
                  callback(true);
               })
               .catch(function(err) {
                  $window.localStorage.setObject('islogged', false);
                  $log.debug('inactiva');
                  $log.debug(err);
                  callback(false);
               });
         };

         check();
         $interval(function() {
            check();
         }, miliseconds);
      };

      this.obtenerPersonas = function() {
         return $http.get(ip + 'Usuario/Sistema/' + configuracion.IDSistema, {
               ignoreLoadingBar: true
            })
            .then(function(resp) {
               return resp.data.Datos;
            });
      };

   }
)

.service('interceptorPersonificar', function() {
   var usuario = null;
   return {
      setUsuarioPersonificar: function(u) {
         usuario = u;
      },
      getUsuarioPersonificar: function() {
         return usuario;
      },
      request: function(config) {
         if (usuario) {
            config.headers.personificado = usuario.Usuario;
         }
         return config;
      }
   };
})

.config(function($httpProvider) {
   $httpProvider.interceptors.push('interceptorPersonificar');
});
