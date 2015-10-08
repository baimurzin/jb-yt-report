'use strict';

function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1  < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') +date.getDate();
}
function formatDateRange(time_begin, time_end) {
    if (time_begin && time_end)
        return formatDate(time_begin) + ' .. ' + formatDate(time_end);
    return formatDate(time_begin || time_end);
}
angular.module('myApp.report', ['ngRoute'])

    .filter('sumPoints', function () {
        return function (data, key) {
            if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
                return 0;
            }
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                sum = sum + (data[i][key] == 'Без оценки' ? 0 : parseInt(data[i][key]));
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
        $scope.showRating = function () {
            $location.path('/rating');
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
                /**
                 * ����� �������� �� ����� �����������
                 */
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
                if (time.created_begin || time.created_end)
                    filter += 'created: ' + formatDateRange(time.created_begin, time.created_end);
                if (time.closed_begin || time.closed_end)
                    filter += ' resolved date: ' + formatDateRange(time.closed_begin, time.closed_end);
                (project ? (filter += ' project: ' + project) : {});
                $http.get('http://jetbrainslab.it.kpfu.ru:8112/rest/issue' + '?with=id&with=summary&with=Assignee&with=Max Point&with=Total point&max=500&after=' + after + filter)
                    .success(function (response) {
                        response.issue.forEach(function (value) {
                            var maxPoint = -1, totalPoint = -1;
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
                            if ((maxPoint != -1 || $scope.allow_null_points) && assignee != '') {
                                if (!$scope.issuesMap[assignee])
                                    $scope.issuesMap[assignee] = [];
                                $scope.issuesMap[assignee].push({
                                    id: value.id,
                                    maxPoint: maxPoint == -1 ? 'Без оценки' : maxPoint,
                                    totalPoint: totalPoint == -1 ? 'Без оценки' : totalPoint,
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
