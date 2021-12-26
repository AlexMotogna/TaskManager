var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM user", function(error, rows) {
    if(error) {
      // res.send({ error: error });
      res.render('users', { users: '' })
    } else {
      // res.send({ users: rows });
      res.render('users', { users: rows })
    }
  });
});

router.get('/add', function(req, res, next) {
  res.render('users/add', { email: '', name: '',  password: '', error: '' })
});

router.post('/add', function(req, res, next) {
  console.log(req.body.name)
  connection.query("INSERT INTO task_manager.user (name, email, password) " +
                      `VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`,
                  function(error, rows) {
    if(error) {
      res.render('users/add', { email: '', name: '',  password: '', error: 'Error' })
    } else {
      res.redirect('/users')
    }
  });

  
});

router.post('/test', function(req, res, next) {
  console.log(req.body)
  res.send('salut')
})

module.exports = router;
