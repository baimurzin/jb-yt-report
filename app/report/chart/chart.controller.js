/**
 * Created by vlad on 24.09.15.
 */
angular
    .module('myApp.chart')
    .controller('ChartReportController', ChartReportController);

ChartReportController.$inject = ['$scope', 'ChartService'];
function ChartReportController($scope, ChartService) {
    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    var mapTooltips = new Map();
    var step  = 5;
    var max   = 100;
    var start = 0;
    $scope.options = {
        scaleOverride: true,
        scaleSteps: Math.ceil((max-start)/step),
        scaleStepWidth: step,
        scaleStartValue: start,
        scaleBeginAtZero: true,
        tooltipTemplate: function(valuesObject){
            var tooltip = mapTooltips.get(valuesObject.label);
            return "task point: "+ tooltip.totalPoint + "\n" + "max point: " + tooltip.maxPoint + "\n" + "summary: " + tooltip.summary;
        },
        multiTooltipTemplate: "<%= value + ' %' %>"
    };
    $scope.onClick = function (points, evt) {
    };
    init();

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
}