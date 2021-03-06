'use strict';

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');

var personService = require('../services/person');
var projectService = require('../services/project');
var decisionService = require('../services/decision');
var dcategoryService = require('../services/dcategory');

var project;
var period;
var decision;
var category;

exports['clear data at start'] = function (test) {
    test.async();
    
    db.clear(function(err, data) {
        test.ok(!err);
        test.done();
    });
};

exports['load initial data simple test'] = function (test) {
    test.async();
    
    loaddata(function (err, data) {
        test.equal(err, null);

        personService.getPersons(function (err, persons) {
            test.ok(!err);
            test.ok(persons);
            test.ok(Array.isArray(persons));
            test.ok(persons.length);
            
            projectService.getProjects(function (err, projects) {
                test.ok(!err);
                test.ok(projects);
                test.ok(Array.isArray(projects));
                test.ok(projects.length);
                project = projects[0];
                test.done();
            });
        });
    });
};

exports['first project has team'] = function (test) {
    test.async();
    
    projectService.getTeam(project.id, function (err, team) {
        test.ok(!err);
        test.ok(team);
        test.ok(Array.isArray(team));
        test.ok(team.length);
        test.equal(team.length, 3);
        
        var alice = team[0];
        
        test.ok(alice);
        test.equal(alice.name, 'Alice');
        
        var bob = team[1];
        
        test.ok(bob);
        test.equal(bob.name, 'Bob');
        
        var charlie = team[2];
        
        test.ok(charlie);
        test.equal(charlie.name, 'Charlie');
        
        test.done();
    });    
}

exports['first project has periods'] = function (test) {
    test.async();
    
    projectService.getPeriods(project.id, function (err, periods) {
        test.ok(!err);
        test.ok(periods);
        test.ok(Array.isArray(periods));
        test.ok(periods.length);
        test.equal(periods.length, 2);
        
        test.equal(periods[0].name, 'January 2014');
        test.equal(periods[0].date, '2014-01-31');
        test.equal(periods[1].name, 'February 2014');
        test.equal(periods[1].date, '2014-02-28');
        
        period = periods[0];
        
        test.done();
    });
}

exports['first project first period has assigments'] = function (test) {
    test.async();
    
    projectService.getAssignments(period.id, function (err, assignments) {
        test.ok(!err);
        test.ok(assignments);
        test.ok(Array.isArray(assignments));
        test.ok(assignments.length);
        test.equal(assignments.length, 6);
        
        test.equal(assignments[0].from.name, 'Alice');
        test.equal(assignments[0].to.name, 'Bob');
        test.equal(assignments[0].amount, 50);
        test.equal(assignments[0].note, 'Arrive earlier');
        
        test.equal(assignments[1].from.name, 'Alice');
        test.equal(assignments[1].to.name, 'Charlie');
        test.equal(assignments[1].amount, 50);
        
        test.done();
    });
}

exports['first project has decisions'] = function (test) {
    test.async();
    
    decisionService.getDecisionsByProject(project.id, function (err, decisions) {
        test.ok(!err);
        test.ok(decisions);
        test.ok(Array.isArray(decisions));
        test.ok(decisions.length);
        test.equal(decisions.length, 2);
        
        test.equal(decisions[0].description, 'First Decision');
        test.equal(decisions[1].description, 'Second Decision');
        
        decision = decisions[0];
        
        test.done();
    });
}

exports['first project has decision categories'] = function (test) {
    test.async();
    
    dcategoryService.getCategoriesByProject(project.id, function (err, categories) {
        test.ok(!err);
        test.ok(categories);
        test.ok(Array.isArray(categories));
        test.ok(categories.length);
        test.equal(categories.length, 2);
        
        test.equal(categories[0].name, 'Technology');
        test.equal(categories[1].name, 'Marketing');
        
        category = categories[0];
        
        test.done();
    });
}

exports['clear data at end'] = function (test) {
    test.async();
    
    db.clear(function (err, data) {
        test.ok(!err);
        test.done();
    });
};

