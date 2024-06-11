'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:ReporteTareasYActividadesCtrl
 * @description
 * # ReporteTareasYActividadesCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
    $stateProvider
        .state('reporte-tareas-actividades', {
            url: '/reporte/tareasyactividades',
            templateUrl: 'views/reporte-tareas-actividades.html',
            controller: 'ReporteTareasYActividadesCtrl',
            cache: false,
            loginRequired: true,
            params: {}
        });
})

.controller('ReporteTareasYActividadesCtrl', function($scope, SweetAlert, reporte,
    catalogoGeneral) {

    $scope.setTitle('Reporte de tareas y actividades');


   var columnas = [{
      title: 'Usuario',
      field: 'Usuario'
   }, {
      title: 'Nombre',
      field: 'Nombre'
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
   },
   {
      title: 'Tareas',
      field: 'Tareas'
   },
   {
      title: 'Actividades',
      field: 'Actividades'
   }, ];


   var itemsPorPagina = 10;

   var total = 0;

   var nombreArchivo = null;

  

      catalogoGeneral.obtenerCadenas()
        .then(function(cadenas) {
            $scope.cadenas = cadenas;
        });

   var toolbar = [{
      template: '<a href="##" class="k-button k-button-icontext" id="exportarExcel"><span class="k-icon k-i-excel"></span>Exportar a Excel</a>',
   }];
   
   var dataSource = {
      transport: {
         read: function(options) {
            var inicio = $scope.inicio || null;
            var fin = $scope.fin || null;
            var cadena = ($scope.cadena && $scope.cadena.ID) || null;
            
            if(inicio === null || fin === null){
                 document.getElementById('valida').style.display = "block";
                    
            }
            else{
                 document.getElementById('valida').style.display = "none";
            }
            reporte.tareasYActividades(options.data.page, options.data.pageSize, inicio, fin, cadena)
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
               var nombreDefault = 'Reporte de tareas y actividades';
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
