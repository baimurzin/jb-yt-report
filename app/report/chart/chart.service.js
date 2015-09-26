/**
 * Created by vlad on 24.09.15.
 */

angular
    .module('myApp.chart')
    .service('ChartService', ChartService);
ChartService.$inject = ['$rootScope'];
function ChartService($rootScope) {
    var data = {};
    return {
        getData: function () {
            return data;
        },
        addData: function (elem) {
            data = elem;
            //$rootScope.$broadcast('incomingChartData');
            //console.log("SENT")

        },
        removeData: function () {

        }
    }
}