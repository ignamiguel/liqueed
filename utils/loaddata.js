'use strict';

var personService = require('../services/person');
var projectService = require('../services/project');
var decisionService = require('../services/decision');
var dcategoryService = require('../services/dcategory');
var noteService = require('../services/note');

function load(filename, cb) {
    if (!cb) {
        cb = filename;
        filename = '../testdata.json';
    }
        
    var data = require(filename);
    var persons = { };

    var l = data.persons.length;
    var k = 0;
    
    doPersonStep();
    
    function doPersonStep() {
        if (k >= l) {
            doProjects();
            return;
        }
        
        var person = data.persons[k++];
        personService.addPerson(person, function (err, id) {
            if (err) {
                cb(err, null);
                return;
            }
            
            persons[person.name] = id;
            
            setImmediate(doPersonStep);
        });
    }
    
    function doProjects() {        var l = data.projects.length;
        var k = 0;
        
        doProjectStep();
        
        function doProjectStep() {            if (k >= l) {
                doNotes();
                return;
            }
            
            var projectdata = data.projects[k++];
            var team = projectdata.team;
            var periods = projectdata.periods;
            var decisions = projectdata.decisions;
            var categories = projectdata.categories;
            var project = { name: projectdata.name };
            
            projectService.addProject(project, function (err, projid) {
                if (err) {
                    cb(err, null);
                    return;
                }
                
                var lt = team.length;
                var kt = 0;
                
                doTeamStep();
                
                function doTeamStep() {                    if (kt >= lt) {
                        doPeriods();
                        return;
                    }
                    
                    var name = team[kt++];
                    var personid = persons[name];
                    
                    if (personid)
                        projectService.addPersonToTeam(projid, personid, function (err, id) {
                            if (err)
                                cb(err, null);
                            else
                                setImmediate(doTeamStep);
                        });
                }
                
                function doPeriods() {                    var lp = periods.length;
                    var kp = 0;
                    
                    doPeriodStep();
                    
                    function doPeriodStep() {
                        if (kp >= lp) {
                            doDecisions();
                            return;
                        }
                        
                        var perioddata = periods[kp++];    
                        var period = { name: perioddata.name, date: perioddata.date, amount: perioddata.amount, closed: perioddata.closed };
                        projectService.addPeriod(projid, period, function (err, periodid) {                            if (err) {
                                cb(err, null);
                                return;
                            }
                            
                            if(perioddata.closed || perioddata.closed == undefined) {
                            	projectService.closePeriod(projid, periodid, function(err,data) {
                            		if(err) {
                            			cb(err,null);
                            			return;
                            		}
                            	});
                            }
                            
                            if (!perioddata.assignments) {
                                setImmediate(doPeriodStep);
                                return;
                            }
                            
                            var la = perioddata.assignments.length;
                            var ka = 0;
                            
                            doAssignmentStep();
                            
                            function doAssignmentStep() {                                if (ka >= la) {
                                    setImmediate(doPeriodStep);
                                    return;
                                }
                                
                                var assignment = perioddata.assignments[ka++];                                var fromid = persons[assignment.from];                                var toid = persons[assignment.to];                                projectService.putAssignment(projid, periodid, fromid, toid, assignment.amount, assignment.note, function (err, id) {
                                    if (err)
                                        cb(err, null);
                                    else
                                        setImmediate(doAssignmentStep);
                                });
                            }
                        });
                    }
                }
                
                function doDecisions() {
                    if (!decisions) {
                        doCategories();
                        return;
                    }
                    
                    var ld = decisions.length;
                    var kd = 0;
                    
                    doDecisionStep();
                    
                    function doDecisionStep() {
                        if (kd >= ld) {
                            doCategories();
                            return;
                        }
                        
                        var decision = decisions[kd++];    
                        decisionService.addDecision(projid, decision, function (err, decisionid) {
                            if (err) {
                                cb(err, null);
                                return;
                            }
                            
                            setImmediate(doDecisionStep);
                        });
                    }
                }
                
                function doCategories() {
                    if (!categories) {
                        doProjectStep();
                        return;
                    }
                    
                    var ld = categories.length;
                    var kd = 0;
                    
                    doCategoryStep();
                    
                    function doCategoryStep() {
                        if (kd >= ld) {
                            doProjectStep();
                            return;
                        }
                        
                        var category = categories[kd++];    
                        
                        dcategoryService.addCategory(projid, category, function (err, categoryid) {
                            if (err) {
                                cb(err, null);
                                return;
                            }
                            
                            setImmediate(doCategoryStep);
                        });
                    }
                }
            });
        }
    }

    function doNotes() {        var l = data.notes.length;
        var k = 0;
        
        doNoteStep();
        
        function doNoteStep() {
            if (k >= l) {
                cb(null, null);
                return;
            }
            
            var note = data.notes[k++];
            
            noteService.addNote(note, function (err, id) {
                if (err)
                    cb(err, null);
                else
                    setImmediate(doNoteStep);
            });
        }
    }
}

module.exports = load;