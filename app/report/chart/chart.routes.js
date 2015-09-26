/**
 * Created by vlad on 24.09.15.
 */
angular
    .module('myApp.chart')
    .config(ChartRoutes);

ChartRoutes.$inject = ['$routeProvider'];

function ChartRoutes($routeProvider) {
    $routeProvider
        .when('/chart', {
            templateUrl: 'report/chart/template/chart-user.html',
            controller: 'ChartReportController as chart'
        })
}