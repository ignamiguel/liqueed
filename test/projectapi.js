
var controller = require('../controllers/projectapi');
var loaddata = require('../utils/loaddata');

var projects;

exports['clear and load data'] = function (test) {
    var personService = require('../services/person');
    var projectService = require('../services/project');
    personService.clear();
    projectService.clear();
    loaddata();
    
    projects = projectService.getProjects();
    
    test.ok(projects);
    test.ok(projects.length);
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
            id: projects[0].id.toString()
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
            id: projects[0].id.toString()
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

exports['get first project periods'] = function (test) {
    var request = {
        params: {
            id: projects[0].id.toString()
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
