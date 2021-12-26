var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
var utils = require('../lib/utils')

router.get('/', function(req, res, next) {
    res.redirect('/auth/login')
});

router.get('/login', function(req, res, next) {
    res.render('auth/login', {email: '', password: '', error: ''})
});

router.post('/login', function(req, res, next) {
    console.log(req.body)
    connection.query(`SELECT * FROM user WHERE email = "${req.body.email}"` +
                        `AND password = "${req.body.password}"`,
                    function(error, rows) {
      if(error) {
        res.render('auth/login', { email: '', name: '',  password: '', error: 'Query error' })
      } else {
        if(rows.length) {
            res.redirect('/users')
        } else {
            res.render('auth/login', { email: '', name: '',  password: '', error: 'Wrong credentials' })
        }
      }
    });
});

router.get('/register', function(req, res, next) {
    res.render('auth/register', { email: '', name: '',  password: '', error: '' })
});

router.post('/register', function(req, res, next) {
    console.log(req.body.name)

    if(utils.validateEmail(req.body.email)) {
      connection.query("INSERT INTO task_manager.user (name, email, password) " +
                      `VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`,
                    function(error, rows) {
        if(error) {
          
        } else {
          res.redirect('/users')
        }
      });
    } else {
      res.render('auth/register', { email: '', name: '',  password: '', error: 'Invallid email' })
    }
});

module.exports = router;