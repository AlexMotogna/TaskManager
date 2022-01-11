var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
var utils = require('../lib/utils');
var dateFormat = require('dateformat');
const { query } = require('express');

router.get('/', utils.authHandler, function(req, res, next) {
    var query = "SELECT * FROM task_manager.goal " +
                `WHERE userid = ${req.session.userid}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            res.render('task', { tasks: result })
        }
    })
});

router.get('/create', utils.authHandler, function(req, res, next) {
    res.render('task/create', { error: '' })
});

router.post('/create', utils.authHandler, function(req, res, next) {
    console.log(req.body)

    if(req.body.name == '') {
        res.render('task/create', { error: 'Please fill the name field' })
    } else {
        var query = "INSERT INTO task_manager.goal (name, description, userid) " +
                    `VALUES ("${req.body.name}", "${req.body.description}", ${req.session.userid})`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
                res.render('task/create', { error: 'SQL error' })
            } else {
                res.redirect('/task/')
            }
        })
    }
});

router.get('/edit/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    
    var query = "SELECT * FROM task_manager.goal " +
                `WHERE id = ${id}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            console.log(result[0].description)
            res.render('task/edit', { task: result , error: '' })
        }
    })
})

router.post('/edit/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    console.log(req.body)

    if(req.body.name == '') {
        var query = "SELECT * FROM task_manager.goal " +
                    `WHERE id = ${id}`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
            } else {
                res.render('task/edit', { task: result , error: 'Please fill the name field' })
            }
        })
    } else {
        var query = "UPDATE task_manager.goal " +
                    `SET name = "${req.body.name}", description = "${req.body.description}" ` +
                    `WHERE id = ${id}`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
            }
            res.redirect('/task/')
        })
    }
})

router.get('/delete/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    var query = `Delete from task_manager.goal WHERE id = ${id}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        }
        res.redirect('/task/')
    })
})

router.get('/complete/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    var query = `UPDATE task_manager.goal SET completedStatus = 1 WHERE id = ${id}`
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        }
        res.redirect('/task/')
    })
})

module.exports = router;