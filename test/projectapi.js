
var controller = require('../controllers/projectapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var personService = require('../services/person');
var projectService = require('../services/project');

var projects;
var project;
var team
var periods;
var period;

exports['clear and load data'] = function (test) {
    db.clear();
    loaddata();
    
    projects = projectService.getProjects();
    
    test.ok(projects);
    test.ok(projects.length);
    
    project = projects[0];
    
    periods = projectService.getPeriods(project.id);
    
    test.ok(periods);
    test.ok(periods.length);
    
    period = periods[0];
    
    team = projectService.getTeam(project.id);
    
    test.ok(team);
    test.ok(team.length);
};

exports['get list'] = function (test) {
    var request = {};

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].name);
            test.done();
        }
    };
    
    controller.list(request, response);
};

exports['get first project'] = function (test) {
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.id, projects[0].id);
            test.equal(model.name, projects[0].name);
            
            test.done();
        }
    };
    
    controller.get(request, response);
};

exports['get first project team'] = function (test) {
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');
            
            test.done();
        }
    };
    
    controller.getTeam(request, response);
};

exports['get first project shareholders'] = function (test) {
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');
            
            test.done();
        }
    };
    
    controller.getShareholders(request, response);
};

exports['get first project periods'] = function (test) {
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 2);
            test.equal(model[0].name, 'January 2014');
            test.equal(model[0].date, '2014-01-31');
            test.equal(model[1].name, 'February 2014');
            test.equal(model[1].date, '2014-02-28');
            
            test.done();
        }
    };
    
    controller.getPeriods(request, response);
};

exports['get first project first period'] = function (test) {
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.equal(model.name, 'January 2014');
            test.equal(model.date, '2014-01-31');
            
            test.done();
        }
    };
    
    controller.getPeriod(request, response);
};

exports['get first project first period assignments'] = function (test) {
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.equal(model.length, 6);

            test.equal(model[0].from.name, 'Alice');
            test.equal(model[0].to.name, 'Bob');
            test.equal(model[0].amount, 50);
            
            test.done();
        }
    };
    
    controller.getAssignments(request, response);
};

exports['get first project first period put assignment'] = function (test) {
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        body: {
            from: team[0].id,
            to: team[1].id,
            amount: 1
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(model.id);
            
            var assignments = projectService.getAssignments(period.id);
            var assignment;
            
            for (var k in assignments)
                if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[1].id && assignments[k].amount == 1) {
                    assignment = assignments[k];
                    break;
                }
            
            test.ok(assignment);
            
            test.done();
        }
    };
    
    controller.putAssignment(request, response);
};

