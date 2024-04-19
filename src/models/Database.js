const sqlite3 = require('sqlite3');

class database {
    constructor() {
        let _pathToDB = 'database.db';
        
        this.database = new sqlite3.Database(_pathToDB, (error) => {
            if(error) {
                console.log('Error in linking to database', error);
            } else { 
                console.log('Successfully connected to database');
            }
        });
    }
}

module.exports = database;
