'use strict'

/**
 * @ngdoc service
 * @name dnwebApp.configuracion
 * @description
 * # configuracion
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
  .service('configuracion', function () {
    var configuracionManual = {
      IDSistema: 6,
      DireccionAndev: 'http://192.6.9.2/DNServices/api/',
      DireccionAnStagging: 'http://192.6.9.5/DNServices/api/',
      DireccionLocal: 'http://192.6.22.91/DNServices/api/',
      DireccionLocalWifi: 'http://192.6.13.108/DNServices/api/',
      DireccionLocalHost: 'http://localhost/DNServices/api/',
      DireccionANStagingPub: 'https://dn-services.ragasa-dev.com.mx/api/',
      webServiceGraphql: 'https://rg-dn-api.azurewebsites.net/graphql',
      DireccionANProdPub: 'https://dn-services.ragasaapps.io/api/',
      DireccionANProdPubAxtel: 'http://189.209.96.236/DNServices/api/',
      DireccionRoccV2StagingAPI: 'https://rg-backend-rocc.azurewebsites.net/',
      DireccionRoccV2ProdAPI: 'https://rg-backend-rocc.azurewebsites.net/',
    }
    configuracionManual.version = '1.0.0'
    configuracionManual.DireccionActiva = configuracionManual.DireccionANStagingPub
    configuracionManual.webServiceGraphql = configuracionManual.webServiceGraphql
    configuracionManual.RoccV2ApiActiva = configuracionManual.DireccionRoccV2StagingAPI
    return configuracionManual
  })
