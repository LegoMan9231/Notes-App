function add(name, password, projects)
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./mydb.sqlite');
    db.serialize(() => {
        const sql = `INSERT INTO accounts (username, password, project_total) VALUES (?, ?, ?)`
        db.run(sql, [name, password, projects], 
            (err) => {
                if (err) {
                    console.error('Error inserting into table:', err.message);
                } else {
                    console.log('Inserted successfully');
                }
            }
        );
    });
    db.close();
}
function remove(name)
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./mydb.sqlite');
    db.serialize(() => {
        const sql = `DELETE FROM accounts WHERE username = ?`
        db.run(sql, [name], 
            (err) => {
                if (err) {
                    console.error('Error deleting from table:', err.message);
                } else {
                    console.log('Deleted successfully');
                }
            }
        );
    });
    db.close();
}
function update(oldName, newName, password, projects)
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./mydb.sqlite');
    db.serialize(() => {
        const sql = `UPDATE accounts SET username = ?, password = ?, project_total = ? WHERE username = ?`
        db.run(sql, [newName, password, projects, oldName], 
            (err) => {
                if (err) {
                    console.error('Error updating the table:', err.message);
                } else {
                    console.log('Updated successfully');
                }
            }
        );
    });
    db.close();
}
function read()
{
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./mydb.sqlite');
    db.serialize(() => {
        db.run(`SELECT * FROM accounts`, 
            (err) => {
                if (err) {
                    console.error('Error reading the table:', err.message);
                } else {
                    console.log('Read successfully');
                }
            }
        );
    });
    db.close();
}