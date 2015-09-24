'use strict';

function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1  < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') +date.getDate();
}
angular.module('myApp.report', ['ngRoute'])

    .filter('sumPoints', function () {
        return function (data, key) {
            if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
                return 0;
            }
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                sum = sum + parseInt(data[i][key]);
            }
            return sum;
        }
    }).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'report/report.html',
            controller: 'ReportCtrl'
        });
    }])

    .controller('ReportCtrl', ['$scope', '$http', '$location', 'ChartService', function ($scope, $http, $location, ChartService) {
        $scope.showChart = function (a ,b) {
            var data = {};
            data.assignee = a;
            data.issue = b;
            ChartService.addData(data);
            $location.path('/chart');
        };
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        $scope.time = {
            created_begin: firstDay,
            created_end: lastDay,
            closed_begin: firstDay,
            closed_end: lastDay
        };
        $http.get('http://jetbrainslab.it.kpfu.ru:8112/rest/project/all')
            .success(function (response) {
                $scope.projects = response;
            })
            .error(function (data, status, headers) {
                if (status == 401) {
                    $location.path('login');
                }
            });
        $scope.createReport = function (project, time, oncreate) {
            //var query = {
            //    "with": ['id', 'name']
            //};
            $scope.issuesMap = {};
            getIssues(0);
            function getIssues(after) {
                var filter = "&filter=";
                filter += 'created: ' + formatDate(time.created_begin) + ' .. ' + formatDate(time.created_end);
                filter += ' resolved date: ' + formatDate(time.closed_begin) + ' .. ' + formatDate(time.closed_end);
                (project ? (filter += ' project: ' + project) : {});
                $http.get('http://jetbrainslab.it.kpfu.ru:8112/rest/issue' + '?with=id&with=summary&with=Assignee&with=Max Point&with=Total point&max=500&after=' + after + filter)
                    .success(function (response) {
                        response.issue.forEach(function (value) {
                            var maxPoint = -1, totalPoint = 0;
                            var assignee = '', summary = '';
                            value.field.forEach(function (field) {
                                if (field.name == "Max point") {
                                    maxPoint = field.value[0];
                                } else if (field.name == "Assignee" && field.value instanceof Array) {
                                    field.value.forEach(function (value) {
                                        if (value.fullName) {
                                            assignee = value.fullName;
                                        }
                                    });
                                } else if (field.name == "Total point") {
                                    totalPoint = field.value[0];
                                } else if (field.name == "summary") {
                                    summary = field.value;
                                }
                            });
                            if (maxPoint != -1 && assignee != '') {
                                if (!$scope.issuesMap[assignee])
                                    $scope.issuesMap[assignee] = [];
                                $scope.issuesMap[assignee].push({
                                    id: value.id,
                                    maxPoint: maxPoint,
                                    totalPoint: totalPoint,
                                    summary: summary
                                });
                            }
                        });
                        if (response.issue.length == 500)
                            getIssues(after + 500);
                        else if (oncreate)
                            oncreate();
                    })
                    .error(function (data, status) {
                        if (status == 401) {
                            $location.path('login');
                        }
                    });
            }
        };
        $scope.saveReport = function () {
            $scope.createReport($scope.project, $scope.time, function () {
                    setTimeout(function () {
                        export_table_to_excel('report')
                    }, 200);
                }
            );
        };
    }]);
