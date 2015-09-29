/**
 * Created by vbaimurzin on 29.09.2015.
 */
angular.
    module('myApp.rating')
    .config(RatingRoutes);

RatingRoutes.$inject = ['$routeProvider'];

function RatingRoutes($routeProvider) {
    $routeProvider
        .when('/rating',{
            templateUrl: 'report/rating/template/rating.html',
            controller: 'RatingController as rating'
        })
}