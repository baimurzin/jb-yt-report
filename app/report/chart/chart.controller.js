/**
 * Created by vlad on 24.09.15.
 */
angular
    .module('myApp.chart')
    .controller('ChartReportController', ChartReportController);

ChartReportController.$inject = ['$scope','ChartService'];
function ChartReportController($scope, ChartService) {
    $scope.labels = []; // название таксков
    $scope.series = []; // на кого из пользователей составляется график
    $scope.data = []; // добавить сюда массив с данными для каждой задачи
    //initialize();
    $scope.onClick = function (points, evt) {
       //do smth
    };

    //function initialize() {
    //    debugger;
    //    var data = ChartService.getData();
    //    $scope.series = data.assignee;
    //    data.issue.forEach(function (val) {
    //        $scope.labels = val.id;
    //        $scope.data = val.totalPoint;
    //    });
    //}
init();
     function init () {
        var d = ChartService.getData();
        $scope.series.push(d.assignee);
         var labels = [];
         var data = [];
        d.issue.forEach(function (val) {
            //debugger;
            labels.push(val.id);
            data.push(val.totalPoint);
        });
         $scope.labels = labels;
         console.log($scope.labels);
         $scope.data.push(data);
         console.log($scope.data);
    }

    //$scope.$on('incomingChartData', function () {
    //    var data = ChartService.getData();
    //    console.log(data);
    //    console.log("EVENT")
    //});
}