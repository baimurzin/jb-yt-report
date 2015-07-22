'use strict';

angular.module('myApp.report', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'report/report.html',
            controller: 'ReportCtrl'
        });
    }])

    .controller('ReportCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $http.get('http://jetbrainslab.it.kpfu.ru:8112/rest/project/all')
            .success(function (response) {
                $scope.projects = response;
            })
            .error(function (data, status, headers){
                if (status == 401) {
                    $location.path('login');
                }
            });

    }]);