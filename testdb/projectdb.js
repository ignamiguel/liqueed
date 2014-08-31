
var service = require('../services/project');
var sperson = require('../services/person');
var sl = require('simplelists');
var async = require('simpleasync');

var db = require('../utils/db');

var liqueedid;
var periodid;
var alanid;
var cymentid;
var cebadorid;
var lavadoid;

exports['use db'] = function (test) {
    test.async();
    
    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

exports['add project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.addProject({ name: 'liqueed' }, next);
    })
    .then(function (result) {
        test.ok(result);
        liqueedid = result;
        test.done();
    })
    .run();
};

exports['get project by id'] = function (test) {
    test.async();
    
    service.getProjectById(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'liqueed');
        test.equal(result.id, liqueedid);
        test.done();
    })
};

exports['get people in empty project'] = function (test) {
    test.async();
    
    service.getTeam(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });    
};

exports['get shareholders in empty project'] = function (test) {
    test.async();
    
    service.getShareholders(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
};

exports['add person and get people in project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sperson.addPerson({ name: 'Alan' }, next);
    })
    .then(function (id, next) {
        alanid = id;
        service.addPersonToTeam(liqueedid, alanid, next);
    })
    .then(function (data, next) {
        service.getTeam(liqueedid, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 1);
        test.equal(result[0].id, alanid);
        test.equal(result[0].name, 'Alan');
        test.done();
    })
    .run();
};

exports['get one shareholder'] = function (test) {
    test.async();
    
    service.getShareholders(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 1);
        test.equal(result[0].id, alanid);
        test.equal(result[0].name, 'Alan');
        test.done();
    });
};

exports['get projects'] = function (test) {
    test.async();
    
    service.getProjects(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
};

exports['get no periods from project'] = function (test) {
    test.async();
    
    service.getPeriods(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
};

exports['add period to project'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.addPeriod(liqueedid, { name: 'First period', date: '2014-01-01', amount: 100 }, next);
    })
    .then(function (id, next) {
        periodid = id;
        test.ok(periodid);
        service.getPeriods(liqueedid, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 1);
        test.equal(result[0].name, 'First period');
        test.equal(result[0].date, '2014-01-01');
        test.equal(result[0].amount, 100);
        test.done();
    })
    .run();
};

exports['get period'] = function (test) {
    test.async();
    
    service.getPeriodById(periodid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.name, 'First period');
        test.equal(result.date, '2014-01-01');
        test.done();
    });
};

exports['get no assignments'] = function (test) {
    test.async();
    
    service.getAssignments(periodid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });    
};

exports['put assignment'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sperson.addPerson({ name: 'Cyment' }, next);
    })
    .then(function (id, next) {
        cymentid = id;
        service.putAssignment(liqueedid, periodid, alanid, cymentid, 50, next);
    })
    .then(function (result, next) {
        test.ok(result);
        service.getAssignments(periodid, next);
    })
    .then(function (list, next) {
        test.ok(list);
        test.ok(Array.isArray(list));
        test.equal(list.length, 1);
        
        test.equal(list[0].from.id, alanid);
        test.equal(list[0].from.name, 'Alan');
        test.equal(list[0].to.id, cymentid);
        test.equal(list[0].to.name, 'Cyment');
        test.equal(list[0].amount, 50);
        
        test.done();
    })
    .run();
};

exports['get shareholders from team and assignments'] = function (test) {
    test.async();
    
    service.getShareholders(liqueedid, function (err, list) {
        test.ok(!err);
        test.ok(list);
        test.ok(Array.isArray(list));
        
        test.equal(list.length, 2);
        
        test.equal(list[0].id, alanid);
        test.equal(list[0].name, 'Alan');
        test.equal(list[1].id, cymentid);
        test.equal(list[1].name, 'Cyment');
        
        test.done();
    });
};

exports['put same assignment different amount'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.putAssignment(liqueedid, periodid, alanid, cymentid, 40, next);
    })
    .then(function (result, next) {
        test.ok(result);
        service.getAssignments(periodid, next);
    })
    .then(function (list, next) {
        test.ok(list);
        test.ok(Array.isArray(list));
        test.equal(list.length, 1);
        
        test.equal(list[0].from.id, alanid);
        test.equal(list[0].from.name, 'Alan');
        test.equal(list[0].to.id, cymentid);
        test.equal(list[0].to.name, 'Cyment');
        test.equal(list[0].amount, 40);
        
        test.done();
    })
    .run();
};

exports['get total assignments by period/person after one assignment only'] = function (test) {
    test.async();
    
    service.getTotalAssignments(liqueedid, periodid, alanid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result, 40);
        test.done();
    });
};

exports['put and get total assignments by period/person'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sperson.addPerson({ name: 'Cebador' }, next);
    })
    .then(function (id, next) {
        cebadorid = id;
        service.putAssignment(liqueedid, periodid, alanid, cebadorid, 60, next);
    })
    .then(function (data, next) {
        service.getTotalAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.equal(result, 100);
        test.done();
    })
    .run();
};

exports['error on assignment too many shares'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.putAssignment(liqueedid, periodid, alanid, cebadorid, 70, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.ok(result.error);
        test.equal(result.error, 'You assigned too many shares');
        service.getTotalAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (total, next) {
        test.ok(total);
        test.equal(total, 100);
        test.done();
    })
    .run();
};

exports['error on assignment too many shares using new person'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        sperson.addPerson({ name: 'Lavado' }, next);
    })
    .then(function (id, next) {
        lavadoid = id;
        service.putAssignment(liqueedid, periodid, alanid, lavadoid, 1, next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.ok(result.error);
        test.equal(result.error, 'You assigned too many shares');
        service.getTotalAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (total, next) {
        test.ok(total);
        test.equal(total, 100);
        test.done();
    })
    .run();
};

exports['get total shares by project'] = function (test) {
    test.async();
    
    service.getShares(liqueedid, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 2);

        test.ok(sl.exist(result, { id: cymentid, name: 'Cyment', shares: 40 }));
        test.ok(sl.exist(result, { id: cebadorid, name: 'Cebador', shares: 60 }));
        
        test.done();
    });
};

exports['put assignments'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.putAssignments(liqueedid, periodid, alanid, [
            { to: cymentid, amount: 40 },
            { to: cebadorid, amount: 60 }
        ], next);
    })
    .then(function (result, next) {
        test.ok(result);
        test.strictEqual(result, true);
        service.getTotalAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (total, next) {
        test.equal(total, 100);
        test.done();
    })
    .run();
};

exports['remove person period assignment'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        service.removeAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (data, next) {
        service.getTotalAssignments(liqueedid, periodid, alanid, next);
    })
    .then(function (total, next) {
        test.equal(total, 0);
        test.done();
    })
    .run();
};

exports['close db'] = function (test) {
    test.async();
    
    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}