'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:AltaPDVCtrl
 * @description
 * # AltaPDVCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

   .config(function ($stateProvider) {
      $stateProvider.state('alta-pdv', {
         url: '/alta/pdv',
         templateUrl: 'views/altapdv.html',
         controller: 'AltaPDVCtrl as vm',
         cache: false,
         loginRequired: true,
         params: {}
      });
   })

   .controller('AltaPDVCtrl', function ($scope, $state, catalogoGeneral, pdvPendiente, alertas, pdv,
      $log, DNConfig, interceptorPersonificar, configuradorCapturaPdv) {

      var vm = this;
      $scope.setTitle('Alta de PDV');
      $scope.asesorComer = [];
      vm.pdv = {};
      vm.pdv.AsesorComercial = interceptorPersonificar.getUsuarioPersonificar() || DNConfig.getUsuarioActivo();
      vm.pdv.AsesorComercial.Label = [
         vm.pdv.AsesorComercial.Nombre,
         vm.pdv.AsesorComercial.ApellidoPaterno,
         vm.pdv.AsesorComercial.ApellidoMaterno,
      ].join(' ');

      $scope.selected = {};

      $scope.agregarEmpleadosAlArbol = function (empleados, empleadoId) {
         $scope.empleados = empleados
         $scope.asesor = null
         var empleadoActual = empleados.find((e) => e.ID === empleadoId)
         $scope.empleadoActual = empleadoActual
         $scope.selected[$scope.empleadoActual.ID] = true
         let idJefeNominal = empleadoActual.IDJefeNominal
         var jerarquiaEmpleadosJefes = []
         if (!idJefeNominal || empleadoActual.PuestoDescripcion == 'Jefe Trade Marketing' || empleadoActual.PuestoDescripcion == 'Sistemas') {
            pdv.obtenerPersonas()
               .then(function (res) {
                  $scope.selected[$scope.empleadoActual.ID] = false
                  $scope.empleadoActual = null
                  $scope.empleados = res.data
                  $scope.puestosGerenciales = ['Gerente Desarrollo de Canal'];
                  $scope.jerarquiaEmpleadosTodos = $scope.empleados.filter((emp) => ($scope.puestosGerenciales.includes(emp.PuestoDescripcion)));
                  for (var e of $scope.jerarquiaEmpleadosTodos) { $scope.selected[e.ID] = false }
               })
               .catch(function (error) {
                  console.error('Error al obtener empleados:', error);
               });

         } else {
            while (idJefeNominal) {
               var empleadoJefe = empleados.find(e => e.ID === idJefeNominal)
               jerarquiaEmpleadosJefes.unshift(empleadoJefe)
               $scope.selected[empleadoJefe.ID] = true
               idJefeNominal = empleadoJefe.IDJefeNominal
            }
            var puestosDescripcionJefes = ['Gerente Desarrollo de Canal', 'Coordinador'];
            $scope.jerarquiaEmpleados = jerarquiaEmpleadosJefes.filter((emp) => puestosDescripcionJefes.includes(emp.PuestoDescripcion))
            $scope.jerarquiaEmpleados.push(empleadoActual)
            var empleadosConMismoNivelDelEmpleadoActual = empleados.filter(e => e.level === empleadoActual.level && e.ID !== empleadoId)
            $scope.jerarquiaEmpleados.push(...empleadosConMismoNivelDelEmpleadoActual)
            //Por si queremos agregar subordinados
            //  var subordinadosDelEmpleadoActual = empleados.filter(e => e.level === empleadoActual.level - 1 && e.IDJefeNominal === empleadoActual.ID)
            //  $scope.jerarquiaEmpleados.push(...subordinadosDelEmpleadoActual)
         }
      }
      $scope.selectedPromotoresVendedorJr = {};
      $scope.algunAsesorComercialSeleccionado = false
      $scope.algunVendedorJrSeleccionado = false
      $scope.disableAll = false
      $scope.jerarquiaEmpleados = [];
      $scope.jerarquiaEmpleadosTodos = [];
      $scope.ultimosEmpleadosIDsSeleccionados = []

      $scope.toggleAll = function (empleado, isSelected) {
         if ($scope.empleadoActual) {
            if (!isSelected) {
               $scope.jerarquiaEmpleados = $scope.jerarquiaEmpleados.filter(e => e.level >= empleado.level)
            } else {
               var subordinadosDelEmpleadoActual = $scope.empleados.filter(e => e.level === empleado.level - 1 && e.IDJefeNominal === empleado.ID)
               $scope.jerarquiaEmpleados.push(...subordinadosDelEmpleadoActual)
            }
         } else {

            if (!isSelected) {
               deseleccionarEmpleadosSubordinados(empleado, empleado)
               $scope.ultimosEmpleadosIDsSeleccionados.pop()
               vm.pdv.AsesorComercial = null;
               $scope.asesor = $scope.ultimosEmpleadosIDsSeleccionados.length? $scope.ultimosEmpleadosIDsSeleccionados : null
            } else {
               var subordinadosDelEmpleadoActual = obtenerSubordinadosDelEmpleadoActual($scope.empleados, empleado)
               var empleadoSeleccionadoIndex = $scope.jerarquiaEmpleadosTodos.findIndex(emp => emp.ID === empleado.ID)
               $scope.jerarquiaEmpleadosTodos.splice(empleadoSeleccionadoIndex + 1, 0, ...subordinadosDelEmpleadoActual)
               // console.log($scope.jerarquiaEmpleadosTodos, "$scope.jerarquiaEmpleadosTodos");
               $scope.ultimosEmpleadosIDsSeleccionados.push(empleado.ID)
               $scope.asesor = empleado
               vm.pdv.AsesorComercial = empleado
            }
         }
      };

      function deseleccionarEmpleadosSubordinados(empleadoSeleccionado, empleadoSeleccionadoBase) {
         var subordinadosDelEmpleadoActual = obtenerSubordinadosDelEmpleadoActual($scope.jerarquiaEmpleadosTodos, empleadoSeleccionado)
         if (subordinadosDelEmpleadoActual.length) {
            return deseleccionarEmpleadosSubordinados(subordinadosDelEmpleadoActual[0], empleadoSeleccionadoBase)
         } else {
            if (empleadoSeleccionado.ID === empleadoSeleccionadoBase.ID) return
            var empleadoSeleccionadoIndex = $scope.jerarquiaEmpleadosTodos.findIndex(emp => emp.ID === empleadoSeleccionado.ID)
            $scope.selected[empleadoSeleccionado.ID] = false
            $scope.jerarquiaEmpleadosTodos.splice(empleadoSeleccionadoIndex, 1)
            return deseleccionarEmpleadosSubordinados(empleadoSeleccionadoBase, empleadoSeleccionadoBase)
         }
      }


      $scope.obtenerJerarquiaPorPuestoDescripcion = obtenerJerarquiaPorPuestoDescripcion
      $scope.isDisabled = isDisabled

      function isDisabled(empleado) {
         var tieneEmpleadosSeleccionados = $scope.ultimosEmpleadosIDsSeleccionados.length
         if (tieneEmpleadosSeleccionados) {
            var ultimoEmpleadoSeleccionado = $scope.jerarquiaEmpleadosTodos.find(emp => emp.ID === $scope.ultimosEmpleadosIDsSeleccionados[tieneEmpleadosSeleccionados - 1])
            var subordinadosDelEmpleadoActual = obtenerSubordinadosDelEmpleadoActual($scope.jerarquiaEmpleadosTodos, ultimoEmpleadoSeleccionado)
            if (ultimoEmpleadoSeleccionado.ID === empleado.ID || subordinadosDelEmpleadoActual.some(e => e.ID === empleado.ID)) {
               return false
            } else {
               return true
            }
         } else {
            return false
         }
      }

      function obtenerJerarquiaPorPuestoDescripcion(puestoDescripcion) {
         let jerarquiaEmpleado = -1
         var jerarquias = {
            6: ['Gerente Desarrollo de Canal'],
            5: ['Jefe Operativo de Zona'],
            4: ['Coordinador'],
            3: ['Asesor Comercial'],
            2: ['Vendedor Jr'],
            1: ['OPV']
         }
         for (var key in jerarquias) {
            if (Object.hasOwnProperty.call(jerarquias, key)) {
               var element = jerarquias[key];
               for (var j of element) {
                  if (j === puestoDescripcion) {
                     jerarquiaEmpleado = key
                  }
               }
            }
         }
         return jerarquiaEmpleado;
      }

      function obtenerSubordinadosDelEmpleadoActual(empleados, empleado) {
         return empleados.filter(e => {
            let jerarquiaEmpleado = obtenerJerarquiaPorPuestoDescripcion(e.PuestoDescripcion)
            let jerarquiaEmpleadoSeleccionado = obtenerJerarquiaPorPuestoDescripcion(empleado.PuestoDescripcion)
            return (e.IDJefeNominal === empleado.ID && Number(jerarquiaEmpleadoSeleccionado) - 1 === (Number(jerarquiaEmpleado)) && e.Activo)
         })
      }
      var userId = vm.pdv.AsesorComercial.ID
      var userName = vm.pdv.AsesorComercial.Usuario
      pdv.obtenerPersonasAcargo(userId, userName)
         .then(function (res) { 

            $scope.agregarEmpleadosAlArbol(res.data, userId);
         })
         .catch(function (error) {
            console.error('Error al obtener empleados:', error);
         });


      configuradorCapturaPdv.configurar(vm);
      vm.limpiarCampos = function () {
         vm.pdv = {};
      };
      vm.guardarPDV = function () {
         pdvPendiente.guardar(vm.pdv)
         .then(function () {
            alertas.exito('Éxito', 'Guardado con éxito');
            vm.limpiarCampos();
            $state.reload()
               })
               .catch(function (err) {
                     $log.debug(err);
                     alertas.error('Error', err.Mensaje);
                  });
      };

     

   });
