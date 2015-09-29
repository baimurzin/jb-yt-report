/**
 * Created by vbaimurzin on 29.09.2015.
 */
angular
    .module('myApp.rating')
    .controller('RatingController', RatingController);

RatingController.$inject = ['$scope', 'Api'];

function RatingController($scope, Api) {
    var vm = this;
    vm.count = null;

    Api.getIssuesCount().then(function (data) {
        console.log('wokr')
        vm.count = data.value;
    })
}