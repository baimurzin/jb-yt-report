/**
 * Created by vbaimurzin on 08.10.2015.
 */
angular
    .module('myApp.rating')
    .service('AssigneeService', AssigneeService);
AssigneeService.$inject = [];

function AssigneeService() {
    /**
     * wpc - last week data
     * apc - all
     * @type {*[]}
     */
    var assignees = {};

    function updateData(assigneeObj) {
        var obj = {};
        if (assigneeObj.type == 'week') {
            var name = assigneeObj.assignee;
            var oldData = retrieveAssigneeData(name);
            var oldWpc = oldData.wpc;
            var newWpc = +assigneeObj.total / +assigneeObj.max;
            newWpc += oldWpc;
            obj.assignee = name;
            obj.apc = oldData.apc;
            obj.wpc = newWpc;
            pushData(obj);
        } else if( assigneeObj.type == 'all') {
            var name = assigneeObj.assignee;
            var oldData = retrieveAssigneeData(name);
            var oldApc = oldData.apc;
            var newApc = +assigneeObj.total / +assigneeObj.max;
            newApc += oldApc;
            obj.assignee = name;
            obj.apc = newApc;
            obj.wpc = oldData.wpc;
            pushData(obj);
        }
        console.log(assignees);
    }

    function pushData(obj) {
        assignees[obj.assignee].apc = obj.apc;
        assignees[obj.assignee].wpc = obj.wpc;
    }

    function retrieveAssigneeData(name) {
        if (assignees.hasOwnProperty(name)) {
            return assignees[name];
        }
    }

    /**
     * if our array does not consist this user yet
     * @param name
     */
    function createNew(name) {
        assignees[name] = {wpc:0, apc:0};
    }

    function isConsist(key) {
        return !!assignees.hasOwnProperty(key);

    }

    return {
        /**
         *
         * @param newAssignee type, max, total, assignee
         */
        add: function (newAssignee) {
            var assigneeName = newAssignee.assignee;
            if (isConsist(assigneeName)) {
                //уже есть, значит обновим данные
                updateData(newAssignee);
            } else {
                createNew(assigneeName);
            }
        },
        getData: function () {
            return assignees;
        }
    }
}