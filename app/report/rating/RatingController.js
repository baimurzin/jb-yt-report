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
    var date = new Date();
    date.setDate(date.getDate() - 7);
    var arr = {};
    var weekAgo = {};
    Api.getIssuesCount().then(function (data) {
        vm.count = data.value;
        var offset = 0;
        while (offset < data.value) {
            getAllIssue(offset);

            getIssueLastWeek(offset);
            offset += 500;
        }
        //calculatePerCentage();
        vm.arr = arr;
    });


    function getAllIssue(offset) {
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
                    updateArr(assignee, {max: max, total: total}, null);
                }
            });
            calculatePerCentage();
        });
    }

    function getIssueLastWeek(offset) {
        var filter = '&filter=resolved date: ' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
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
                    updateArr(assignee, null, {max: max, total: total});
                }
            });
            calculatePerCentageWeek();
            console.log(data);
        });
    }


    function calculatePerCentage() {
        for (var prop in arr) {
            var pc = arr[prop].all.total / arr[prop].all.max;
            arr[prop].all.pc = pc;
        }
    }

    function calculatePerCentageWeek() {
        for (var prop in arr) {
            var pc2 = arr[prop].week.total / arr[prop].week.max;
            arr[prop].week.pc = pc2;
        }
    }

    function updateArr(assignee, value, week) {
        if (value != null) {
            if (arr.hasOwnProperty(assignee)) {
                var obj = arr[assignee].all;
                if (!isNaN(Number(value.total))) {
                    obj.total = +obj.total + +value.total;
                } else {
                    obj.total = +obj.total + +0;
                }

                if (!isNaN(Number(value.max))) {
                    obj.max = +obj.max + +value.max;
                } else {
                    obj.max = +obj.max + +0;
                }
                arr[assignee].all = obj;
            } else {
                arr[assignee] = {all: {max: 0, total: 0}};
            }
        }
        if (week != null) {
            if (arr.hasOwnProperty(assignee)) {
                var obj = arr[assignee].week;
                if (!isNaN(Number(week.total))) {
                    obj.total = +obj.total + +week.total;
                } else {
                    obj.total = +obj.total + +0;
                }

                if (!isNaN(Number(week.max))) {
                    obj.max = +obj.max + +week.max;
                } else {
                    obj.max = +obj.max + +0;
                }
                arr[assignee].week = obj;
                console.log(arr);
            }
        }
    }
}


function Assignee(name) {
    this.name = name;
    this.maxPoint = 0; //максимально возможный
    this.totalPoint = 0;　// сколько получил
}

Assignee.prototype.addTask = function (taskObj) {
    this.maxPoint = taskObj.max;
};