'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteConfiguracionRutasCtrl
 * @description
 * # ReporteConfiguracionRutasCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider.state('reporte-configuracion-rutas', {
      url: '/reporte/configuracion-rutas',
      templateUrl: 'views/reporte-configuracion-rutas.html',
      controller: 'ReporteConfiguracionRutasCtrl',
      cache: false,
      loginRequired: true,
      params: {}
   });
})


.controller('ReporteConfiguracionRutasCtrl', function($scope, reporte, SweetAlert, catalogoGeneral) {

   $scope.setTitle('Reporte de Configuración de Rutas');

   // Usuario | Nombre | CodigoJDE | CodigoSIC | PDV | L | M | M | J | V | S | Frecuencia | Fecha Proxima Visita
   var columnas = [{
      title: 'Usuario',
      field: 'Usuario'
   }, {
      title: 'Nombre',
      field: 'Nombre'
   }, {
      title: 'Puesto',
      field: 'Puesto'
   }, {
      title: 'Descripción Ruta',
      field: 'Descripcion'
   }, {
      title: 'Código JDE',
      field: 'CodigoJDE'
   }, {
      title: 'Código SIC',
      field: 'CodigoSIC'
   }, {
      title: 'PDV',
      field: 'PDV'
   }, {
      title: 'L',
      field: 'Lunes'
   }, {
      title: 'M',
      field: 'Martes'
   }, {
      title: 'M',
      field: 'Miercoles'
   }, {
      title: 'J',
      field: 'Jueves'
   }, {
      title: 'V',
      field: 'Viernes'
   }, {
      title: 'S',
      field: 'Sabado'
   }, {
      title: 'Frecuencia',
      field: 'Frecuencia'
   }, {
      title: 'UT',
      field: 'UT'
   }, {
      title: 'Canal',
      field: 'Canal'
   }, {
      title: 'Cadena',
      field: 'Cadena'
   }, {
      title: 'Gerente Canal',
      field: 'GerenteCanal'
   }, {
      title: 'Asesor',
      field: 'Asesor'
   } ,{
      title: 'Promotor',
      field: 'Promotor'
   }, {
      title: 'Zona NIELSEN',
      field: 'ZonaNIELSEN'
   }, {
      title: 'Zona ISCAM',
      field: 'ZonaISCAM'
   }, {
      title: 'Ciudad',
      field: 'Ciudad'
   }, {
      title: 'Tipo PDV',
      field: 'TipoPDV'
   }, {
      title: 'Segmento PDV',
      field: 'SegmentoPDV'
   }];

   catalogoGeneral.obtenerFuncionales()
         .then(function(usuarios) {
            $scope.usuarios = usuarios;
            $scope.usuario = usuarios[0];
         });

         catalogoGeneral.obtenerCadenas()
         .then(function(cadenas) {
            $scope.cadenas = cadenas;

         });

   var isNull = 0;

   var itemsPorPagina = 10;

   var total = 0;

   var nombreArchivo = null;

   var toolbar = [{
      template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
   }];

   var dataSource = {
      transport: {
         read: function(options) {

            var cadena = null;
            if($scope.cadena != null)
            {
               cadena = $scope.cadena.ID;
            }

            reporte.configuracionRutas($scope.usuario.Usuario, cadena, $scope.pdv, options.data.page, options.data.pageSize)
               .then(function(datos) {

                  // procesar nombres de columnas

                  total = datos.TotalRegistros || total;
                  datos.Reporte.forEach(function(registro) {
                     registro.Frecuencia = registro.Frecuencia + (registro.Frecuencia === 1 ? ' semana' : ' semanas');
                  });
                  options.success(datos);

                  
               })
               .catch(function() {
                  options.error('No se ha podido ejecutar la consulta.');
               });
         },
      },
      schema: {
         total: function() {
            return total;
         },
         data: 'Reporte',
         parse: function(datos) {
            console.log(datos);
            return datos;
         },
      },
      serverPaging: true,
      serverSorting: true,
       page: 1,
   };
     
   // Redimensiona las columnas para que no tenga wrapping
        function dataBound() {
      $scope.$evalAsync(function() {
         $scope.grid.columns.forEach(function(e, i) {
            $scope.grid.autoFitColumn(i);
         });
      });
   }


   $scope.buscar = function() {
      
       $('#grid').data('kendoGrid').setOptions({
                  columns: columnas,
                  scrollable: true,
                  resizable: true,
                  dataSource: dataSource,
                  toolbar: toolbar,

                  
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
                      page: 1,
                     
                  },
                  dataBound: dataBound,
               });
              

      $('#exportarExcel')
         .kendoButton({
            click: function() {
               var nombreDefault = 'Reporte de Registro de Información';
               SweetAlert.swal({
                  title: 'Exportar',
                  text: 'Escriba el nombre del archivo',
                  type: 'input',
                  showCancelButton: true,
                  inputValue: nombreDefault,
                  showLoaderOnConfirm: true,
                  closeOnConfirm: false,
               }, function(nombre) {
                  if (nombre === false) {
                     return;
                  }
                  if (!nombre || nombre.trim() === '') {
                     nombre = nombreDefault;
                  }
                  nombre += '.xlsx';
                  nombreArchivo = nombre;
                  $('#grid').data('kendoGrid').saveAsExcel();
               });
            }
         });
   };

});
