// database.js
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database (or open if it exists)
const db = new sqlite3.Database('./mydb.sqlite');

// Create the users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  // Create projects table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    ProjectID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER,
    title TEXT,
    jsonAddress TEXT,
    FOREIGN KEY(UserID) REFERENCES users(id) ON DELETE SET NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating projects table:', err.message);
        } else {
            console.log('Projects table created successfully');
        }
});
});

// Function to delete duplicate entries
const deleteDuplicates = () => {
  // Step 1: Find duplicate usernames
  const findDuplicatesSQL = `
    SELECT username, COUNT(*) as count
    FROM users
    GROUP BY username
    HAVING count > 1;
  `;

  db.all(findDuplicatesSQL, [], (err, rows) => {
    if (err) {
      console.error('Error fetching duplicates:', err);
      return;
    }

    if (rows.length === 0) {
      console.log('No duplicates found.');
      return;
    }

    // Step 2: For each duplicate, delete the extra entries
    rows.forEach(row => {
      const username = row.username;

      // Deleting duplicates but keeping the first one (based on the rowid)
      const deleteDuplicatesSQL = `
        DELETE FROM users
        WHERE username = ? AND rowid NOT IN (
          SELECT MIN(rowid)
          FROM users
          WHERE username = ?
        );
      `;

      db.run(deleteDuplicatesSQL, [username, username], function (err) {
        if (err) {
          console.error(`Error deleting duplicates for username ${username}:`, err);
        } else {
          console.log(`Deleted duplicate entries for username: ${username}`);
        }
      });
    });
  });
};

// Call the function to delete duplicates
deleteDuplicates();


module.exports = db;