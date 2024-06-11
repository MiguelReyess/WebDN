'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReportePdvsSinAsignarCtrl
 * @description
 * # ReportePdvsSinAsignarCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')


.config(function($stateProvider) {
   $stateProvider.state('reporte-pdvs-sin-asignar', {
      url: '/reporte/pdvs-sin-asignar',
      templateUrl: 'views/reporte-pdvs-sin-asignar.html',
      controller: 'ReportePdvsSinAsignarCtrl',
      cache: false,
      loginRequired: true,
      params: {}
   });
})


.controller('ReportePdvsSinAsignarCtrl', function($scope, reporte, SweetAlert) {

   $scope.setTitle('Reporte de PDVs sin Asignar');

   // CodigoJDE | ID | PDV
   var columnas = [{
      title: 'Código JDE',
      field: 'CodigoJDE'
   }, {
      title: 'Código SIC',
      field: 'ID'
   }, {
      title: 'PDV',
      field: 'Nombre'
   }, ];

   var itemsPorPagina = 10;

   var total = 0;

   var nombreArchivo = null;

   var toolbar = [{
      template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
   }];

   var dataSource = {
      transport: {
         read: function(options) {
            reporte.pdvsSinAsignar(options.data.page, options.data.pageSize)
               .then(function(datos) {
                  // procesar nombres de columnas
                  total = datos.TotalRegistros || total;
                  if (total === 0) {
                     SweetAlert.warning('Sin Resultados', 'La búsqueda no ha regresado resultados.');
                  }
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
      $scope.grid.setOptions({
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
