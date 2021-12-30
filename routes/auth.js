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
            req.session.userid = rows[0].id
            res.redirect('/events')
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
          res.render('auth/register', { email: '', name: '',  password: '', error: 'Query error' })
        } else {
          req.session.userid = rows[0].id
          res.redirect('/events')
        }
      });
    } else {
      res.render('auth/register', { email: '', name: '',  password: '', error: 'Invallid email' })
    }
});

router.get('/logout', function(req, res, next) {
  req.session.userid = undefined
  res.redirect('/auth/login')
});

module.exports = router;