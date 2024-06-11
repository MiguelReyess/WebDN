'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.pdv
 * @description
 * # pdv
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')

.service('pdv', function(webservices, Upload, configuracion) {

    this.actualizar = function(pdv) {
        var postData = pdv;
        return webservices.put('PDV/' + pdv.ID, postData);
    };

    this.altaMasiva = function(archivo) {
        var url = configuracion.DireccionActiva + 'PDV/xlsx';
        return Upload.upload({
            url: url,
            data: {
                file: archivo
            },
        });
    };

    this.guardarLista = function(lista) {
        return webservices.post('PDV/List', lista);
    };

    /*
       Filtros disponibles
       id, codigojde, zona, nombre, municipio, estado, grupocanal, canal,
       tipocliente, segmentopdv, cadena, asesor, clasificacioncliente
     */
    this.buscar = function(page, pageSize, filtros, cache) {
        var params = {
            page: page,
            pageSize: pageSize,
        };
        angular.merge(params, filtros);
        return webservices.get('PDV/Busqueda', {}, {
            params: params,
            cache: cache
        });
    };

    this.buscarFiltros = function(page, pageSize, filtros, cache) {
        var params = {
            page: page,
            pageSize: pageSize,
        };
        angular.merge(params, filtros);
        return webservices.get('PDV/BusquedaFiltros', {}, {
            params: params,
            cache: cache
        });
    };

    this.obtenerDeAsesor = function(idAsesor) {
        return webservices.get('PDV/Asesor/' + idAsesor);
    };

    this.guardarDeAsesor = function(idAsesor, pdvs) {
        return webservices.put('PDV/Asesor/' + idAsesor, pdvs);
    };

    this.obtener = function(id) {
        return webservices.get('PDV/' + id);
    };

    this.guardarDeAsesor = function(pdv) {
        return webservices.put('PDV/AsignarPersonas/' + pdv.ID, pdv);
    };

    this.obtenerResponsables = function(idPDV) {
        return webservices.get('PDV/idpdv/Responsables'.replace('idpdv', idPDV));
    };

    this.obtenerPersonasAcargo =function(id,userName){
        return webservices.getCustom('persona/getPersonaTree?personaId='+ id + '&username='+ userName );
    }
    
    this.obtenerPersonas = function(){
        return webservices.getCustom('persona/getPersonas');
    }
}); 