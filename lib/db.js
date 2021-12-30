var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_manager',
    multipleStatements: true
});

connection.connect(function(error) {
    if(!!error) {
        console.log(error);
        return;
    } else {
        console.log('Connected!');
    }
});

module.exports = connection;
