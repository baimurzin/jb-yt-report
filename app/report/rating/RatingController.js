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
    var arr = {
        week : [],
        all : []
    };
    Api.getIssuesCount().then(function (data) {
        vm.count = data.value;
        var offset = 0;
        while (offset < data.value) {
            getAllIssue(offset);
            getIssueLastWeek(offset);
            offset += 500;
        }
        arrangeData();
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
                    //debugger;
                    updateArr(assignee, null, {max: max, total: total});
                }
            });
            debugger;
            calculatePerCentageWeek();
        });
    }

    function arrangeData() {
        $scope.$watch(function () {
            return vm.arr;
        }, function (newVal) {
            console.log(newVal);
        });
    }


    function calculatePerCentage() {
        for (var prop in arr.all) {
            var pc = arr.all[prop].total / arr.all[prop].max;
            arr.all[prop].pc = pc.toFixed(2) * 100;
        }
    }

    function calculatePerCentageWeek() {
        for (var prop in arr.week) {
            var pc2 = arr.week[prop].total / arr.week[prop].max;
            arr.week[prop].pc = pc2.toFixed(2)*100;
        }
    }

    function updateArr(assignee, value, week) {
        if (value != null) {
            if (arr.all.hasOwnProperty(assignee)) {
                var obj = arr.all[assignee];
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
                arr.all[assignee] = obj;
            } else {
                arr.all[assignee] = {max:0, total:0};
            }
        }
        if (week != null) {
            if (arr.week.hasOwnProperty(assignee)) {
                var obj = arr.week[assignee];
                if (!isNaN(Number(week.total))) {
                    obj.total = +obj.total + +week.total;
                } else {
                    try {
                        obj.total = +obj.total + +0;
                    } catch (e) {
                        debugger;
                        console.log(assignee);
                    }
                }

                if (!isNaN(Number(week.max))) {
                    obj.max = +obj.max + +week.max;
                } else {
                    obj.max = +obj.max + +0;
                }
                arr.week[assignee] = obj;
            } else {
                arr.week[assignee] = {max: 0, total:0}
            }
        }
    }
}


function Assignees(name) {
    this.name = name;
    this.maxPoint = 0; //максимально возможный
    this.totalPoint = 0;　// сколько получил
}

Assignee.prototype.addTask = function (taskObj) {
    this.maxPoint = taskObj.max;
};