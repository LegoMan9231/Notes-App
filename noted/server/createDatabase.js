const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');
db.serialize(() => {
    // Create Accounts table
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            project_total INTEGER
            )`, (err) => {
                if (err) {
                    console.error('Error creating accounts table:', err.message);
                } else {
                    console.log('Accounts table created successfully');
                }
    });

});
db.close();