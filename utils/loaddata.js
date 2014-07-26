
var personService = require('../services/person');
var projectService = require('../services/project');

function load(filename) {
    if (!filename)
        filename = '../data.json';
        
    var data = require(filename);        var persons = { };
    
    data.persons.forEach(function (person) {
        var id = personService.addPerson(person);        persons[person.name] = id;
    });

    data.projects.forEach(function (projectdata) {
        var team = projectdata.team;
        var periods = projectdata.periods;        var project = { name: projectdata.name };
        
        var projid = projectService.addProject(project);                team.forEach(function (name) {            var personid = persons[name];                        if (personid)                projectService.addPersonToTeam(projid, personid);        });                periods.forEach(function (perioddata) {            var period = { name: perioddata.name, date: perioddata.date, amount: perioddata.amount };            var periodid = projectService.addPeriod(projid, period);                        if (!perioddata.assignments)                return;                            perioddata.assignments.forEach(function (assignment) {                var fromid = persons[assignment.from];                var toid = persons[assignment.to];                projectService.addAssignment(periodid, fromid, toid, assignment.amount);            });        });
    });
}module.exports = load;