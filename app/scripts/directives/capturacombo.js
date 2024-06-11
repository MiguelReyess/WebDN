'use strict';

/**
 * @ngdoc directive
 * @name dnwebApp.directive:capturaCombo
 * @description
 * # capturaCombo
 */
angular.module('dnwebApp')
   .directive('capturaCombo', function($timeout, $parse) {
      var nombreCounter = 0;

      function getNombreNuevo() {
         nombreCounter += 1;
         return 'capturaCombo' + nombreCounter.toString();
      }

      return {
         templateUrl: 'views/capturacombo.html',
         restrict: 'E',
         require: ['^form'],
         scope: {
            label: '@',
            name: '@',
            array: '=',
            change: '&',
            model: '=',
            conVacio: '=',
            textoOpcion: '@',
            trackBy: '@',
         },
         compile: function compile(element, attr) {
            var select = element.find('ui-select');
            angular.forEach({
               'required': attr.required,
               'ng-required': attr.ngRequired,
            }, function(value, name) {
               if (angular.isDefined(value)) {
                  select.attr(name, value);
               }
            });

            if (!attr.name) {
               attr.name = getNombreNuevo();
            }

            // Getter para texto de opcion
            var opcionLabel = $parse(attr.textoOpcion);

            var repeatExpr = 'item in (array | filter: $select.search)';
            var parseTrackBy = null;
            if (attr.trackBy && attr.trackBy.length > 0) {
               repeatExpr += ' track by ' + attr.trackBy;
               parseTrackBy = $parse(attr.trackBy);
            }

            var uichoices = element.find('ui-select-choices');
            uichoices.attr('repeat', repeatExpr);

            var uiselect = element.find('ui-select');
            uiselect.attr('name', attr.name);

            return function postLink(scope, element, attr, controllers) {
               var form = controllers[0];

               scope.opcionLabel = opcionLabel;

               function extractor(valor) {
                  return parseTrackBy({
                     item: valor
                  });
               }

               scope.$watch('array', function(n, o) {
                  if (n !== o) {
                     // Ver si sigue existiendo el item en la lista
                     if (parseTrackBy) {
                        var comparador = _.partial(_.isEqual, extractor(scope.model));
                        if (!_.some(_.map(n, extractor), comparador)) {
                           scope.model = null;
                        }
                     } else {
                        if (!_.some(n, _.partial(_.isEqual, scope.model))) {
                           scope.model = null;
                        }
                     }
                  }
               });

               scope.form = form;
               scope.cambio = function() {
                  scope.$evalAsync(function() {
                     scope.change();
                  });
               };

            };
         },
      };
   });
