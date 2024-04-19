// this file is to set the initial configuration of the database 

// import sqlite and database class
const sqlite3 = require('sqlite3');

// open connection to database     
const pathToDB = 'database.db';

const initial_database = new sqlite3.Database(pathToDB, (error) => {
    if(error) {
        console.log('Error in linking to database for initialization', error);
    } else { 
        console.log('Successfully connected to database for initialization');
    }
});

initial_database.close((error) => {
    if(error) {
        console.log('Error in closing database after initialization', error);
    } else { 
        console.log('Successfully closed database after initialization');
    }
});

function createTable(database, tableName, attributes) {
    tableColumns = attributes.join(', ');

    database.run(
        `CREATE TABLE IF NOT EXISTS ${tableName} (
            ${tableColumns}
        )`,

        (error) => {
            if(error) {
                console.log(`Table ${tableName} not created:`, error);
            } else {
                console.log(`Table ${tableName} successfully created or already exists.`);
            }
        }
    )
}

function insertInitialData(database, tableName, columnNames, inputValues) {
    const valueString = '(' + columnNames.map(() => '?').join(',') + ')'; // outputs (?,?, ... ?)

    database.run(
        `INSERT INTO ${tableName} 
            (${columnNames.join(', ')}) 
            VALUES ${valueString}
        `,
        inputValues,

        (error) => {
            if(error) {
                console.log(`Data failed to INSERT into ${tableName}`, error);
            } else {
                console.log(`Data INSERTed into ${tableName}`);
            }
        }
    );
}