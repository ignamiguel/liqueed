'use strict';

var controller = require('../controllers/projectapi');

var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var async = require('simpleasync');

var persons;

exports['use db'] = function (test) {
    test.async();
    
    db.useDb('liqueed-test', null, function (err, data) {
        test.ok(!err);
        test.ok(data);
        test.done();
    });
}

var projectapi = require('../test/projectapi');

for (var n in projectapi)
    exports[n] = projectapi[n];

exports['close db'] = function (test) {
    test.async();
    
    db.closeDb(function (err, data) {
        test.ok(!err);
        test.ok(!data);
        test.done();
    });
}
