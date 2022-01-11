var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
var utils = require('../lib/utils');
var dateFormat = require('dateformat');
const { query } = require('express');

router.get('/(:id)', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    console.log(id)

    var query = `SELECT * FROM task_manager.progress WHERE goalid = ${id} ` +
                "ORDER BY time"
    connection.query(query, function(error, result) {
        if (error) {
            console.log(error)
        } else {
            res.render('progress', { progress: result, dateFormat: dateFormat, goalid: id })
        }
    })
});

router.get('/(:id)/create', utils.authHandler, function(req, res, next) {
    var id = req.params.id
    console.log(id)
    res.render('progress/create', { error: '', goalid: id })
});

router.post('/(:id)/create', utils.authHandler, function(req, res, next) {
    var id = req.params.id

    if(req.body.hoursspent == '') {
        res.render('progress/create', { error: 'Please fill the hours spent field', goalid: id })
    } else {
        var query = "INSERT INTO task_manager.progress (description, time, hoursspent, goalid) " +
                    `VALUES ("${req.body.description}", sysdate(), ${parseInt(req.body.hoursspent)}, ${id})`
        connection.query(query, function(error, result) {
            if (error) {
                console.log(error)
                res.render('/progress/create', { error: 'SQL Error', goalid: id })
            } 
            res.redirect(`/task/progress/${id}`)
        })
    }
});

module.exports = router;