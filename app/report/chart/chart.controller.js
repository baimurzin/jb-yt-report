/**
 * Created by vlad on 24.09.15.
 */
angular
    .module('myApp.chart')
    .controller('ChartReportController', ChartReportController);

ChartReportController.$inject = ['$scope', 'ChartService'];
function ChartReportController($scope, ChartService) {
    $scope.labels = []; // название таксков
    $scope.series = []; // на кого из пользователей составляется график
    $scope.data = []; // добавить сюда массив с данными для каждой задачи
    var mapTooltips = new Map();
    $scope.options = {
        // String - Template string for single tooltips
        tooltipTemplate: function(valuesObject){
            var tooltip = mapTooltips.get(valuesObject.label);
            // do different things here based on whatever you want;
            return "task point: "+ tooltip.totalPoint + "\n" + "max point: " + tooltip.maxPoint + "\n" + "summary: " + tooltip.summary;
        },
        // String - Template string for multiple tooltips
        multiTooltipTemplate: "<%= value + ' %' %>"
    };
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
    //testData();
    function init() {
        var d = ChartService.getData();
        $scope.series.push(d.assignee);
        var labels = [];
        var data = [];
        d.issue.forEach(function (val) {
            var maxPoint = val.maxPoint;
            var totalPoint = val.totalPoint;
            var percent = totalPoint / maxPoint * 100;
            labels.push(val.id);
            data.push(percent);
            mapTooltips.set(val.id, {maxPoint:maxPoint, totalPoint:totalPoint, summary:val.summary})
        });
        $scope.labels = labels;
        $scope.data.push(data);
    }

    function testData() {
        $scope.series.push('TEST');
        var labels = [];
        for (var i = 1; i < 21; i++) {
            labels.push('TASK-' + i);
        }
        $scope.labels = labels;
        var data = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 100];
        $scope.data.push(data);
    }

    //$scope.$on('incomingChartData', function () {
    //    var data = ChartService.getData();
    //    console.log(data);
    //    console.log("EVENT")
    //});
}