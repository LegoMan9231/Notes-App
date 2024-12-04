const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = new sqlite3.Database('./mydb.sqlite');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // This will load variables from .env into process.env

const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};


// Serve static files from the 'projects_json' directory
app.use('/projects_json', express.static(path.join(__dirname, 'projects_json')));

// Creates the tables
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

    rows.forEach(row => {
      const username = row.username;

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

deleteDuplicates();

// Function to register a new user with a hashed password
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error saving user to database' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
  });
});

// Function to login a user by verifying their password
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
        // Generate JWT token
        const token = jwt.sign(
          { userId: row.id, username: row.username },
          process.env.JWT_SECRET, // This pulls the JWT_SECRET from your .env file
          { expiresIn: '1h' } // Optional: Set an expiration time for the token
        );

        return res.status(200).json({ message: 'Login successful', token });
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
          return res.status(500).json({ message: 'Error creating JSON file', error: err.message });
        }

        res.status(201).json({ message: 'Project created successfully', projectID: this.lastID });
      });
    }
  );
});


// Route to get project data based on the title
app.get('/api/projects/:title', authenticateToken, (req, res) => {
  const { title } = req.params;

  const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
  const jsonFilePath = path.join(__dirname, 'projects_json', `${formattedTitle}.json`);

  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading project file:', err);
      return res.status(500).json({
        message: 'Error reading project data',
        error: err.message,
      });
    }

    try {
      const projectData = JSON.parse(data);
      res.json(projectData);
    } catch (parseErr) {
      console.error('Error parsing project data:', parseErr);
      return res.status(500).json({
        message: 'Error parsing project data',
        error: parseErr.message,
      });
    }
  });
});


// Save project data
app.post('/api/projects/save/:title', (req, res) => {
  const { title } = req.params;
  const { textBoxes } = req.body;

  if (!Array.isArray(textBoxes)) {
    return res.status(400).json({ message: 'Invalid textBoxes data format' });
  }

  // Ensure the title is formatted correctly (lowercase and hyphens instead of spaces)
  const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
  const jsonFilePath = path.join(__dirname, 'projects_json', `${formattedTitle}.json`);

  // Data to save
  const dataToSave = { textBoxes };

  fs.writeFile(jsonFilePath, JSON.stringify(dataToSave, null, 2), (err) => {
    if (err) {
      console.error('Error saving project file:', err);
      return res.status(500).json({ message: 'Error saving project data', error: err.message });
    }
    res.json({ message: 'Project data saved successfully' });
  });
});

// Lists all projects owned by userID
app.get('/api/projectList', authenticateToken, (req, res) => {
  // Extract the userId from the JWT token (stored in req.user)
  const userID = req.user.userId;

  // SQL query to fetch all projects for the authenticated user
  const sql = `SELECT * FROM projects WHERE UserID = ?`;

  db.all(sql, [userID], (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ message: 'Error fetching projects', error: err.message });
    }

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No projects found for this user.' });
    }
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
