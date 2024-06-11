'use strict';

/**
 * @ngdoc function
 * @name dnwebApp.controller:PdvExportarCtrl
 * @description
 * # PdvExportarCtrl
 * Controller of the dnwebApp
 */
angular.module('dnwebApp')

.config(function($stateProvider) {
    $stateProvider.state('pdv-exportar/pdv/', {
        url: '/pdv/exportar',
        templateUrl: 'views/pdv-exportar.html',
        controller: 'PdvExportarCtrl as vm',
        cache: false,
        loginRequired: true,
        params: {}
    });
})

.controller('PdvExportarCtrl', function($scope) {

    var vm = this;

    $scope.setTitle('Exportación de PDVs');

    vm.pdvActual = null;

    vm.pdvSeleccionado = function(pdv) {
        vm.pdvActual = pdv;
    };

});