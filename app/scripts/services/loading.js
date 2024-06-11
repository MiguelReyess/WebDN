'use strict';

/**
 * @ngdoc service
 * @name dnwebApp.loading
 * @description
 * # loading
 * Service in the dnwebApp.
 */
angular.module('dnwebApp')
   .service('loading', ['$rootScope', '$injector',
      function($rootScope, $injector) {
         var $modal;
         var modal;
         var loadingsOpenned = 0;
         var preventOneCount = 0;
         var turnOnOnceCount = 0;

         var isOn = true;

         var isPreventOne = function() {
            var isPrevent = false;
            if (preventOneCount > 0) {
               isPrevent = true;
               preventOneCount--;
            }

            return isPrevent;
         };

         var isTurnOnce = function() {
            var isTurn = false;
            if (turnOnOnceCount > 0) {
               isTurn = true;
               turnOnOnceCount--;
            }

            return isTurn;
         };

         return {
            preventOne: function() {
               preventOneCount++;
            },
            preventAll: function() {
               isOn = false;
            },
            turnOnOnce: function() {
               turnOnOnceCount++;
            },
            turnOnAll: function() {
               isOn = true;
            },
            showLoading: function(mensaje) {
               if (!$modal) {
                  $modal = $injector.get('$uibModal');
               }

               if (((isTurnOnce() || isOn) && !isPreventOne())) {
                  mensaje = mensaje || 'Cargando, Espere...';

                  if (loadingsOpenned === 0) {
                     modal = $modal.open({
                        templateUrl: 'template/loadingContentID.html',
                        backdrop: true,
                        keyboard: false,
                        windowTemplateUrl: 'template/loadingBackdropID.html',
                        controller: function($scope) {
                           $scope.mensaje = mensaje;
                        }
                     });
                  }

                  loadingsOpenned++;
               }
            },
            hideLoading: function() {
               if (modal && loadingsOpenned > 0) {
                  modal.dismiss();
                  loadingsOpenned--;
               }
            },
            setModal: function(m) {
               $modal = m;
            }
         };
      }
   ]);
