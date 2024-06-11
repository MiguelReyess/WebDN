/* eslint-disable no-useless-varructor, dot-notation, space-before-function-paren, semi, no-undef, indent, padded-blocks, no-var */
'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:Altaconfigcuestionariov2Ctrl
 * @description
 * # Altaconfigcuestionariov2Ctrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')
  .controller('AltaConfigCuestionariov2Ctrl', function ($scope, $log, $timeout,
    Upload, catalogoGeneral, configuracionCuestionario, SweetAlert) {
    $scope.puestosRequeridos = [ "Asesor Comercial", "Promotor","Gerente Canal","OPV","Coordinador"];
    $scope.cargandoArchivo = false;
    $scope.buenos = null;

    function configVacia() {
      return {
        ID: null,
        TipoCuestionario: null,
        FechaInicio: null,
        FechaFin: null,
        Cuestionario: null,
        Titulo: null,
        DescCorta: null,
        Codigo: null,
        ForzarGuardado: null,
        PDVsAsignados: null,
        PuestosAplica: null
      };
    }


    $scope.puestosAMostrar = {
      'Asesor Comercial': 'Ejecutivo',
      'Vendedor JR': 'Ejecutivo',
      'Gerente Canal': 'Staff',
      'Gerente Zona': 'Staff'
    };

    $scope.configuracion = configVacia();

    $scope.setTitle('Configuración de Cuestionarios versión 2');

    catalogoGeneral.obtenerTiposCuestionario().then(function (tipos) {
      $scope.tiposCuestionario = tipos;
    });

    catalogoGeneral.obtenerPuestos().then(function (puestos) {
      $scope.puestos = puestos;
      // console.log("puestos", puestos);
      $scope.nuevosPuestos = $scope.puestos.filter((p) => $scope.puestosRequeridos.includes(p.Descripcion) );
    });

    catalogoGeneral.obtenerCuestionariosv2().then(function (cuestionarios) {
      $scope.cuestionarios = cuestionarios
    });

    $scope.pdvsResultado = [{
      DescCorta: 'Soriana'
    }, {
      DescCorta: 'HEB'
    }];

    $scope.cambiaCuestionario = function () {
      $scope.configuracion.Titulo = $scope.configuracion.Cuestionario.setting.Titulo || $scope.configuracion.Cuestionario.name || '';
      $scope.configuracion.DescCorta = $scope.configuracion.Cuestionario.setting.Codigo || $scope.configuracion.Cuestionario.slug || '';
      $scope.configuracion.TipoCuestionario = $scope.configuracion.Cuestionario.setting.TipoCuestionario;
      $scope.configuracion.FechaInicio = $scope.configuracion.Cuestionario.setting.FechaInicio;
      $scope.configuracion.FechaFin = $scope.configuracion.Cuestionario.setting.FechaFin;
      $scope.configuracion.Codigo = $scope.configuracion.Cuestionario.setting.Codigo;
      $scope.configuracion.Orden = $scope.configuracion.Cuestionario.setting.Orden;
      $scope.configuracion.PuestosAplica = $scope.configuracion.Cuestionario.setting.PuestosAplica;
      $scope.configuracion.PuestosAplica = $scope.configuracion.Cuestionario.setting.PuestosAplica;
      $scope.buenos = $scope.configuracion.Cuestionario.setting.PDVsAsignados.map(function (item) { return item.ID; });

      // console.log($scope.configuracion, "cambiaCuestionario")
    };

    $scope.cargarArchivo = function (archivo) {
      if (!archivo) {
        return;
      }
      $scope.cargandoArchivo = true;
      $scope.malos = null;
      $scope.buenos = null;
      $scope.repetidos = null;

      configuracionCuestionario.subirCSV(archivo).then(function (resp) {
        var datos = resp.data.Datos;

        if (datos.Malos.length) {
          $scope.malos = datos.Malos;
        } else if (datos.Buenos.length) {
          var repetidos = datos.Buenos.slice(0)
            .sort()
            .reduce(function (accum, elt, indice, arr) {
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
      }).catch(function () {
        SweetAlert.error('Error', 'El archivo no se pudo procesar.');
      }).finally(function () {
        $scope.cargandoArchivo = false;
        $log.info('cargando false');
      });
    };

    $scope.limpiar = function () {
      $scope.configuracion = configVacia();
      $scope.buenos = null;
      $scope.malos = null;
    };

    $scope.agregarPDV = function (pdv) {
      // console.log(pdv);
    };

    $scope.seleccionaIDs = function (ids) {
      if (angular.isArray(ids) === false) {
        ids = [ids.ID];
      }

      $scope.buenos = $scope.buenos || [];
      $scope.buenos = _.uniq($scope.buenos.concat(ids));
    };

    $scope.guardar = function () {
      var asesor = $scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Asesor Comercial");
      var gerente = $scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Gerente Canal");
      if (asesor.length) {
        var vendedorJr = {
          ID: 14,
          Descripcion: "Vendedor JR",
        };
        if (!$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion === "Vendedor JR").length) 
        {
          $scope.configuracion.PuestosAplica.push(vendedorJr);
        }
      } else {
        $scope.configuracion.PuestosAplica =$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion !== "Vendedor JR" );
      }
      if (gerente.length) {
        var gerenteZona = {
          ID: 12,
          Descripcion: "Gerente Zona",
        };

        if (!$scope.configuracion.PuestosAplica.filter((p) => p.Descripcion === "Gerente Zona").length) {
            $scope.configuracion.PuestosAplica.push(gerenteZona);
        }
      } else {
        $scope.configuracion.PuestosAplica =$scope.configuracion.PuestosAplica.filter( (p) => p.Descripcion !== "Gerente Zona");
      }
      if (!$scope.buenos || $scope.buenos.length === 0) {
         SweetAlert.error('Validación', 'Favor de enviar el archivo con PDVs para el cuestionario.');
      } else {
         $scope.configuracion.PDVsAsignados = $scope.buenos.map(function(elt) {
            return { ID: elt };
         });

          configuracionCuestionario.guardarv2($scope.configuracion).then(function() {
            SweetAlert.success('Éxito', 'Se ha guardado la configuración exitosamente.');
            $scope.limpiar();
          }).catch(function(err) {
            if (!angular.isString(err)) {
                err = '';
            }
            SweetAlert.error('Error', 'No se ha podido guardar la configuración.\n' +
                err);
          });
      }
    };

  });
