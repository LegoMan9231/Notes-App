const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');
db.serialize(() => {
    // Create Accounts table
    db.run(`INSERT INTO accounts (username, password, project_total)
            VALUES ('Alex', 'Password', 21)`, (err) => {
                if (err) {
                    console.error('Error inserting into table:', err.message);
                } else {
                    console.log('Inserted successfully');
                }
    });

});
db.close();