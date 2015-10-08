/**
 * Created by vbaimurzin on 08.10.2015.
 */
amgular
    .module('myApp.rating')
    .service('AssigneeService', AssigneeService);
AssigneeService.$inject = [];

function AssigneeService() {
    /**
     * wpc - last week data
     * apc - all
     * @type {*[]}
     */
    var assignees = [];

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
    }

    function pushData(obj) {
        assignees.forEach(function (elem) {
            if (elem.assignee == obj.assignee) {
                elem.apc = obj.apc;
                elem.wpc = obj.wpc;
            }
        })
    }

    function retrieveAssigneeData(name) {
        for (var a in assignees) {
            if (a.assignee == name) {
                return a;
            }
        }

    }

    /**
     * if our array does not consist this user yet
     * @param name
     */
    function createNew(name) {
        var obj = {};
        obj.assignee = name;
        obj.wpc = 0;
        obj.apc = 0;
        assignees.push(obj);
    }

    return {
        /**
         *
         * @param newAssignee type, max, total, assignee
         */
        add: function (newAssignee) {
            var assigneeName = newAssignee.assignee;
            if (this.isConsist(assigneeName)) {
                //уже есть, значит обновим данные
                updateData(newAssignee);
            } else {
                createNew(assigneeName);
            }
        },
        isConsist: function (key) {
            for (var k in assignees) {
                if (k.assignee == key) {
                    return true;
                }
            }
            return false;
        }
    }
}