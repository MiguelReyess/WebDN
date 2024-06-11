'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.cuestionario
 * @description
 * # cuestionario
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
    .service('cuestionario', function ($http, configuracion) {

        var url = configuracion.DireccionActiva;

        this.rechazar = function (idHistorico) {
            return $http.delete(url + 'Cuestionario/Rechazar/' + idHistorico)
                .then(function (resp) {
                    return resp.data.Datos;
                });
        };

        function obtenerCuestionario(servicio, idHistorico) {
            var path = url + 'Cuestionario/' + servicio + '/' + idHistorico;
            return $http.get(path)
                .then(function (resp) {
                    return resp.data.Datos;
                });
        }

        // Crear los métodos de obtención de datos de cuestionarios
        var cuestionariosPorTipo = {
            '1': 'Mercadeo',
            '2': 'Salida',
            '3': 'Bodega',
            '4': 'Geolocalizacion',
            '5': 'Promocion',
            '6': 'Exhibicion',
            '8': 'ArmadoCombos',
            '9': 'PromocionCompetencia',
            '10': 'ColocacionPOP',
            '11': 'InformacionEspecificaProducto',
            '12': 'Inventario',
            '13': 'IncidenciaMercadeo',
            '14': 'Precio',
            '15': 'PrecioCompetencia',
            '17': 'StoreCheck/Operacion',
            '18': 'StoreCheck/Anaquel',
            '19': 'StoreCheck/FueraAnaquel',
            '20': 'StoreCheck/Herramienta',
            '21': 'RevisionBTL/Nutrioli',
            '22': 'ControlInventarios',
            '23': 'Negociacion',
            '24': 'Generico',
            '25': 'Cocina',
            '26': 'ColocacionCollarin',
            '28': 'Abordaje',
            '29': 'InventarioDemostradora',
            '30': 'Frentes',
            '31': 'PromocionCompetenciaDemostradora',
            '32': 'ExhibicionDemostradora',
            '33': 'Tramos',

            '46': 'StoreCheck/Planograma',
            '47': 'StoreCheck/Merchandising',
            '48': 'StoreCheck/Inventario',
            '49': 'StoreCheck/Ejecución',
            '50': 'StoreCheck/Exhibiciones',
            '61': 'CampanaDeMarca',
            '58': 'ProductosRagasa',
            '59': 'ProductosCompetencia',
            '60': 'StoreCheck/ImagenPromotor',
        };

        this.metodoParaIdCuestionario = function (idCuestionario) {
            return this['obtener' + cuestionariosPorTipo[idCuestionario.toString()]];
        };

        this.plantillaParaIdCuestionario = function (idCuestionario) {
            console.log('idCuestionario', idCuestionario)
            return cuestionariosPorTipo[idCuestionario.toString()].replace(/[ \/]/g, '');
        };

        var self = this;
        Object.keys(cuestionariosPorTipo)
            .map(function (key) {
                return cuestionariosPorTipo[key];
            })
            .forEach(function (servicio) {
                self['obtener' + servicio.replace('/', '')] = function (idHistorico) {
                    return obtenerCuestionario(servicio, idHistorico);
                };
            });
    });