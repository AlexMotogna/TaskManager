var mysql = require('mysql');

class Connection {
    static singletonInstance = undefined;

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'task_manager',
            multipleStatements: true
        });

        this.connection.connect(function(error) {
            if(!!error) {
                console.log(error);
                return;
            } else {
                console.log('Connected!');
            }
        });
    }

    static instance() {
        if(this.singletonInstance == undefined) {
            this.singletonInstance = new Connection();
        }
        return this.singletonInstance;
    }
}

module.exports = Connection.instance().connection;
