var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
var utils = require('../lib/utils');
var dateFormat = require('dateformat');
const { query } = require('express');

router.get('/', utils.authHandler, function(req, res, next) {

    var createdEventsQuery = "SELECT event.id AS eventid, event.name AS eventname, description, time, status, creatorid, user.id AS userid, user.name AS username " +
        "FROM task_manager.event join task_manager.user on event.creatorid = user.id " +
        `WHERE user.id = "${req.session.userid}"`
    var invitedEventsQuery = "SELECT * FROM task_manager.eventparticipation " +
        "join task_manager.user on eventparticipation.userid = user.id " +
        "join task_manager.event on event.id = eventparticipation.eventid " +
        `WHERE user.id = "${req.session.userid}"`

    var query = `${createdEventsQuery}; ${invitedEventsQuery}`;

    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            res.render('events', { createdEvents: result[0], invitedEvents: result[1], dateFormat: dateFormat })
        }
    })
});

router.get('/create', utils.authHandler, function(req, res, next) {
    res.render('events/create', { error: '' })
});

router.post('/create', utils.authHandler, function(req, res, next) {
    console.log(req.body)

    if(isNaN(Date.parse(req.body.date)) || req.body.name == '' || req.body.status == '') {
        res.render('events/create', { error: 'Please fill all fields' })
    } else {
        var timeValue = dateFormat(req.body.date, "yyyy-mm-dd hh:MM:ss")
        console.log(timeValue)
        
        var query = "INSERT INTO task_manager.event (name, description, time, status, creatorid) " +
                    `VALUES ("${req.body.name}", "${req.body.description}", "${timeValue}", "${req.body.status}", ${req.session.userid})`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
                res.render('events/create', { error: 'SQL error' })
            } 
            res.redirect('/events/')
        })
    }
});

router.get('/edit/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id

    var queryEvent = `Select * from task_manager.event WHERE id = ${id}`
    var queryParticipation = "SELECT userid, eventid, accepted, user.name AS username, " +
                            "event.name AS eventname FROM task_manager.eventparticipation " +
                            `join task_manager.event on eventid = event.id ` +
                            `join task_manager.user on userid = user.id ` +
                            `WHERE eventid = ${id}`
    var query = `${queryEvent}; ${queryParticipation}`;
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
            res.redirect('/events/')
        } else {
            res.render('events/edit', { event: result[0], participants: result[1], dateFormat: dateFormat, error: '' })
        }
    })
});

router.post('/edit/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    console.log(id)

    if(isNaN(Date.parse(req.body.date)) || req.body.name == '' || req.body.status == '') {
        var queryEvent = `Select * from task_manager.event WHERE id = ${id}`
        var queryParticipation = "SELECT userid, eventid, accepted, user.name AS username, " +
                                "event.name AS eventname FROM task_manager.eventparticipation " +
                                `join task_manager.event on eventid = event.id ` +
                                `join task_manager.user on userid = user.id ` +
                                `WHERE eventid = ${id}`
        var query = `${queryEvent}; ${queryParticipation}`;
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
                res.redirect('/events/')
            } else {
                res.render('events/edit', { event: result[0], participants: result[1], dateFormat: dateFormat, error: 'Please fill all fields' })
            }
        })
    } else {
        var timeValue = dateFormat(req.body.date, "yyyy-mm-dd hh:MM:ss")
        console.log(timeValue)
        var query = "UPDATE task_manager.event " +
                    `SET name = "${req.body.name}", description = "${req.body.description}", ` +
                    `time = "${timeValue}", status = "${req.body.status}" WHERE id = ${id}`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
            }
        })
        res.redirect('/events/')
    }
});

router.get('/invite/(:id)', utils.authHandler, function(req, res, next){
    var id = req.params.id

    var query = "Select user.name, user.id from task_manager.user " +
                    "WHERE user.id NOT IN ( " +
                    "SELECT user.id from task_manager.user " +
                    "join task_manager.eventparticipation on user.id = userid " +
                    "join task_manager.event on event.id = eventid " +
                    `WHERE eventid = ${id})`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
            res.render('events/invite', { users: result, eventid: id })
        }
    })
});

router.post('/invite/(:id)', utils.authHandler, function(req, res, next){
    var id = req.params.id

    var query = "INSERT INTO task_manager.eventparticipation (userid, eventid, accepted) " +
                `VALUES (${req.body.userid}, ${id}, "PENDING")`
    console.log(query)
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } 
        res.redirect('/events/')
    })
});

router.get('/delete/(:id)', utils.authHandler, function(req, res, next){
    var id = req.params.id
    var query = `Delete from task_manager.event WHERE id = ${id}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        }
        res.redirect('/events/')
    })
});

router.get('/(:id)/confirm', utils.authHandler, function(req, res, next) {
    var eventId = req.params.id
    console.log(eventId)

    var query = 'UPDATE task_manager.eventparticipation SET accepted = "ACCEPTED" ' +
                `WHERE userid = ${req.session.userid} and eventid = ${eventId}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            res.redirect('/events/')
        }
    })	
});

router.get('/(:id)/deny', utils.authHandler, function(req, res, next) {
    var eventId = req.params.id
    console.log(eventId)

    var query = 'UPDATE task_manager.eventparticipation SET accepted = "DENIED" ' +
                `WHERE userid = ${req.session.userid} and eventid = ${eventId}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            res.redirect('/events/')
        }
    })	
});


module.exports = router;