'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:AltatareaCtrl
 * @description
 * # AltatareaCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.controller('AltaTareaCtrl', function($scope, Upload, SweetAlert,
   configuracionCuestionario, tarea, actividad, $state) {

   var esTarea = $state.is('alta-tarea');

   if (esTarea) {
      $scope.setTitle('Alta de Tareas');
   } else {
      $scope.setTitle('Alta de Actividades');
   }

   $scope.cargarArchivo = function(archivo) {
      if (!archivo) {
         return;
      }
      $scope.cargandoArchivo = true;
      $scope.malos = null;
      $scope.buenos = null;
      $scope.repetidos = null;

      configuracionCuestionario.subirCSV(archivo)
         .then(function(resp) {
            var datos = resp.data.Datos;
            if (datos.Malos.length) {
               $scope.malos = datos.Malos;
            } else if (datos.Buenos.length) {
               var repetidos = datos.Buenos.slice(0)
                  .sort()
                  .reduce(function(accum, elt, indice, arr) {
                     var last = accum[accum.length - 1];
                     if (elt === arr[indice - 1] && elt !== last) {
                        accum.push(elt);
                     }
                     return accum;
                  }, []);
               if (repetidos.length) {
                  SweetAlert.error('Error', 'Codigos duplicados.');
                  $scope.repetidos = repetidos;
               } else {
                  $scope.buenos = datos.Buenos;
               }
            }
         })
         .catch(function() {
            SweetAlert.error('Error', 'El archivo no se pudo procesar.');
         })
         .finally(function() {
            $scope.cargandoArchivo = false;
         });
   };

   $scope.guardar = function() {
      var pdvs = $scope.buenos.map(function(codigo) {
         return {
            ID: codigo,
         };
      });
      var datos = {
         FechaInicio: $scope.fechaInicio,
         FechaFin: $scope.fechaFin,
         PDVs: pdvs,
      };
      var promesa;
      if (esTarea) {
         datos.DescTarea = $scope.contenido;
         promesa = tarea.guardar(datos);
      } else {
         datos.Descripcion = $scope.contenido;
         promesa = actividad.guardar(datos);
      }
      promesa.then(function() {
         SweetAlert.success('Éxito', 'Los datos se guardaron correctamente.');
         $scope.limpiar();
      });
   };

   $scope.limpiar = function() {
      $scope.contenido = null;
      $scope.fechaInicio = null;
      $scope.fechaFin = null;

      $scope.malos = null;
      $scope.buenos = null;
      $scope.repetidos = null;
   };

   $scope.seleccionaIDs = function(ids) {
      if (angular.isArray(ids) === false) {
         ids = [ids.ID];
      }
      $scope.buenos = $scope.buenos || [];
      $scope.buenos = _.uniq($scope.buenos.concat(ids));
   };

});
