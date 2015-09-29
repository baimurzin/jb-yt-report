'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    //'ngCookies',
    'myApp.report',
    'myApp.login',
    'myApp.chart',
    'myApp.rating'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/report'});
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);
