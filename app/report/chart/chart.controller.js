/**
 * Created by vlad on 24.09.15.
 */
angular
    .module('myApp.chart')
    .controller('ChartReportController', ChartReportController);

ChartReportController.$inject = ['$scope'];
function ChartReportController($scope) {
    $scope.test = "works fine";
}