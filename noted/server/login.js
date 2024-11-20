// app.js
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('./createDatabase'); // Import the database module
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors());

// Function to register a new user with a hashed password
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Insert the username and hashed password into the database
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
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Retrieve the hashed password from the database
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving user' });
    }
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, row.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (isMatch) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
