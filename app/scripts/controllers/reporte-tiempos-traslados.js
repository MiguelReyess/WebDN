'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteTiemposTrasladosCtrl
 * @description
 * # ReporteTiemposTrasladosCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
   $stateProvider
      .state('reporte-tiempos-traslados', {
         url: '/reporte/tiempos',
         templateUrl: 'views/reporte-tiempos-traslados.html',
         controller: 'ReporteTiemposTrasladosCtrl',
         cache: false,
         loginRequired: true,
         params: {}
      });
})

.controller('ReporteTiemposTrasladosCtrl', function($scope, SweetAlert, reporte,
   catalogoGeneral) {

   $scope.setTitle('Reporte de Tiempos y Traslados');

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
      title: 'Codigo JDE',
      field: 'CodigoJDE'
   }, {
      title: 'Código SIC',
      field: 'ID'
   }, {
      title: 'PDV ',
      field: 'PDV'
   }, {
      title: 'Fecha ',
      field: 'Fecha',
   }, {
      title: 'Inicio Visita',
      field: 'InicioVisita',
   }, {
      title: 'Fin Visita',
      field: 'FinVisita',
   }, {
      title: 'Orden Real',
      field: 'OrdenReal'
   }, {
      title: 'Orden Planeado',
      field: 'OrdenPlaneado'
   }, {
      title: 'Tiempo EnTienda',
      field: 'TiempoEnTienda'
   }, {
      title: 'Minutos Traslado',
      field: 'MinutosTraslado'
   }, {
      title: 'Minutos Apoyo Tienda',
      field: 'MinutosApoyoTienda'
   }, {
      title: 'Distancia Inicio Visita Tienda',
      field: 'DistanciaTiendaInicio'
   }, {
      title: 'Distancia Fin Visita Tienda',
      field: 'DistanciaTiendaFin'
   }, {         
      title: 'Bateria Inicio',
      field: 'BateriaInicio'
   }, {
      title: 'Bateria Fin',
      field: 'BateriaFin'
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
      title: 'Asesor Comercial',
      field: 'AsesorComercial'
   }, {
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
   }, ];


   var itemsPorPagina = 10;

   var total = 0;

   var nombreArchivo = null;

   catalogoGeneral.obtenerFuncionales()
      .then(function(usuarios) {
         $scope.usuarios = usuarios;
         $scope.usuario = usuarios[0];
      });

   var toolbar = [{
      template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
   }];

   var dataSource = {
      transport: {
         read: function(options) {
            var inicio = $scope.inicio || null;
            var fin = $scope.fin || null;
            var usuario = ($scope.usuario && $scope.usuario.ID) || null;

            reporte.tiemposTraslados(options.data.page, options.data.pageSize, inicio, fin, usuario)
               .then(function(datos) {
                  // procesar nombres de columnas
                  total = datos.TotalRegistros || total;
                  datos.Reporte.forEach(function (registro) {
                     registro.Fecha = moment(registro.Fecha).format('DD-MMM-YYYY');
                     registro.InicioVisita = moment(registro.InicioVisita).format('DD-MMM-YYYY HH:mm:ss');
                     registro.FinVisita = registro.FinVisita ? moment(registro.FinVisita).format('DD-MMM-YYYY HH:mm:ss') : '';
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
            return datos;
         },
      },
      serverPaging: true,
      serverSorting: true,
   };

   // Redimensiona las columnas para que no tenga wrapping
   function dataBound() {
      $scope.$evalAsync(function() {
         var grid = $('#grid').data('kendoGrid');
         grid.columns.forEach(function(e, i) {
            grid.autoFitColumn(i);
         });
      });
   }

   $scope.buscar = function() {
      $('#grid')
         .data('kendoGrid')
         .setOptions({
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
      $('#grid')
         .find('#exportarExcel')
         .kendoButton({
            click: function() {
               var nombreDefault = 'Reporte de Tiempos y Traslados';
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
