const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = new sqlite3.Database('./mydb.sqlite');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());

//Creates the tables
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
    thumbnail TEXT,
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

// Function to register a new user with a hashed password
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      console.log("Username or password not provided");
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Error hashing password' });
      }
  
      const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
      db.run(sql, [username, hashedPassword], function (err) {
        if (err) {
          console.error('Error saving user to database:', err);
          return res.status(500).json({ message: 'Error saving user to database' });
        }
        console.log('User registered:', this.lastID);
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
      });
    });
  });
  
  // Function to login a user by verifying their password
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving user' });
      }
      if (!row) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      bcrypt.compare(password, row.password_hash, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
        if (isMatch) {
          return res.status(200).json({ message: 'Login successful' });
        } else {
          return res.status(401).json({ message: 'Invalid password' });
        }
      });
    });
  });
  // Route to create a new project
app.post('/api/projects', (req, res) => {
  const { UserID, title, thumbnail } = req.body;

  // Sanitize title for file name (remove spaces, special chars)
  const jsonFileName = title.toLowerCase().replace(/\s+/g, '-') + '.json';
  
  // Path to the folder where JSON files will be saved
  const jsonDir = path.join(__dirname, 'projects_json');
  
  // Ensure the directory exists, create it if it doesn't
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  // The full file path for the new project's JSON file
  const jsonAddress = path.join(jsonDir, jsonFileName);

  const newProject = {
    UserID,
    title,
    thumbnail,
    jsonAddress
  };

  // Insert project into SQLite3 database
  db.run(
    `INSERT INTO projects (UserID, title, thumbnail, jsonAddress) VALUES (?, ?, ?, ?)`,
    [newProject.UserID, newProject.title, newProject.thumbnail, newProject.jsonAddress],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating project', error: err.message });
      }

      // Create the JSON file
      const projectData = { title: newProject.title, UserID: newProject.UserID };

      // Log the path for debugging
      console.log('Attempting to write JSON file at:', newProject.jsonAddress);

      // Write the JSON data to the file
      fs.writeFile(newProject.jsonAddress, JSON.stringify(projectData, null, 2), (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
          return res.status(500).json({ message: 'Error creating JSON file', error: err.message });
        }

        // Respond with success
        res.status(201).json({ message: 'Project created successfully', projectID: this.lastID });
      });
    }
  );
});

// Route to get all projects (for the frontend)
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching projects', error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/projects/${projectId}', (req, res) => {
  const { projectId } = req.params;
  console.log('Fetching project with ID:', projectId);  // Log the projectId being requested

  const sql = 'SELECT * FROM projects WHERE title = ?';
  db.get(sql, [projectId], (err, row) => {
    if (err) {
      console.error('Error fetching project:', err);
      return res.status(500).json({ message: 'Error fetching project', error: err.message });
    }
    if (!row) {
      console.log(`Project with ID ${projectId} not found.`);
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(row);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

