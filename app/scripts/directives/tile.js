 'use strict';

/**
 * @ngdoc directive
 * @name dhwebApp.directive:tile
 * @description
 * # tile
 */
angular.module('dnwebApp')
    .directive('tile', function() {
        var template = '<div class="tile {{class}} {{colorClass}}">';
        template += '<div class="col-md-3">';
        template += '<i class="{{iconClass}}"></i>';
        template += '</div>';
        template += '<div class="col-md-9 text-right">';
        template += '<h3 class="title">{{title}}</h3>';
        template += '</div>';
        template += '<div class="col-md-12 text-right">';
        template += '<p>{{content}}</p>';
        template += '</div>';
        template += '</div>';
        return {
            scope: {
                class: '=',
                colorClass: '=', //css class
                iconClass: '=', //css class
                title: '=',
                content: '='
            },
            template: template,
            restrict: 'E',
            link: function postLink(scope, element, attrs) {}
        };
    });
