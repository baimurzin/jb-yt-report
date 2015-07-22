'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.login = function (user) {
            $http({
                url: 'http://jetbrainslab.it.kpfu.ru:8112/rest/user/login',
                method: 'post',
                data: 'login=' + user.login + '&password=' + user.password,
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Accept": 'application/xml'
                }
            })
            .success(function (data, status, headers) {
                $location.path('/');
            })
            .error(function () {
            });
        };
    }]);