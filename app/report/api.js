/**
 * Created by vbaimurzin on 29.09.2015.
 */
angular
    .module('myApp')
    .service("Api", ApiService);

ApiService.$inject = ['$http', '$q'];

function ApiService($http, $q) {

    var baseUrl = 'http://jetbrainslab.it.kpfu.ru:8112/rest/';

    /**
     * @param after ... not mine
     * @returns {list} Return the List of Issues
     */
    function getIssues(after) {
        var defer = $q.defer();
        //взял как вынос функция из report.js в отдельный муодль АПИ
        $http.get(baseUrl +'issue/' + '?with=id&with=summary&with=Assignee&with=Max Point&with=Total point&max=500&after='+after)
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (error) {
                defer.reject(error);
            });
        return defer.promise;
    }

    /**
     *
     * @returns {number} Return a Number of Issues
     */
    function getIssuesCount() {
        var defer = $q.defer();

        $http.get(baseUrl+ 'issue/' + 'count')
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (error) {
                defer.reject(error);
            });
        return defer.promise;
    }//можно юзать вместо after =500 в getIssues()

    /**
     *
     * @returns {*} Returns Accessible Projects
     */
    function getAllProjects() {
        var defer = $q.defer();
        $http.get(baseUrl + 'project/all')
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (error) {
                defer.reject(error);
            });
        return defer.promise;
    }


    return {
        getIssues: getIssues,
        getIssuesCount: getIssuesCount,
        getAllProjects: getAllProjects
    };
}