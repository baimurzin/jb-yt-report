/**
 * Created by vbaimurzin on 29.09.2015.
 */
angular
    .module('myApp.rating')
    .controller('RatingController', RatingController);

RatingController.$inject = ['$scope', 'Api', 'AssigneeService'];

function RatingController($scope, Api, AssigneeService) {
    var vm = this;
    vm.count = null;
    var date = new Date();
    date.setDate(date.getDate() - 7);
    Api.getIssuesCount().then(function (data) {
        vm.count = data.value;
        var offset = 0;
        while (offset < data.value) {
            getAllIssue(offset);
            getIssueLastWeek(offset);
            offset += 500;
        }
        vm.arr = AssigneeService.getData();
    });


    function getAllIssue(offset) {
        var type = 'all';
        Api.getIssues('?with=id&with=summary&with=Assignee&with=Max Point&with=Total point&max=500&after=' + offset).then(function (data) {
            data.issue.forEach(function (issue) {
                var total, max, assignee;
                issue.field.forEach(function (field) {
                    if (field.name == "Max point") {
                        max = field.value[0];
                    } else if (field.name == "Assignee" && field.value instanceof Array) {
                        field.value.forEach(function (val) {
                            if (val.fullName) {
                                assignee = val.fullName;
                            }
                        })
                    } else if (field.name == "Total point") {
                        total = field.value[0];
                    } else if (field.name == "summary") {
                    }
                });
                if (assignee) {
                    AssigneeService.add({
                        type:type,
                        max:max,
                        total:total,
                        assignee: assignee
                    });

                }
            });

        });
    }

    function getIssueLastWeek(offset) {
        var type = 'week';
        //var filter = '&filter=resolved date: ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
        var endDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        var filter = '&filter=resolved date: 2014-06-02 .. ' + endDate;
        Api.getIssues('?with=id&with=summary&with=Assignee&with=Max Point&with=Total point&max=500&after=' + offset + filter).then(function (data) {
            data.issue.forEach(function (issue) {
                var total, max, assignee;
                issue.field.forEach(function (field) {
                    if (field.name == "Max point") {
                        max = field.value[0];
                    } else if (field.name == "Assignee" && field.value instanceof Array) {
                        field.value.forEach(function (val) {
                            if (val.fullName) {
                                assignee = val.fullName;
                            }
                        })
                    } else if (field.name == "Total point") {
                        total = field.value[0];
                    } else if (field.name == "summary") {
                    }
                });
                if (assignee) {

                    AssigneeService.add({
                        type:type,
                        max:max,
                        total:total,
                        assignee: assignee
                    });

                }
            });

        });
    }

}
