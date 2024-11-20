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
      console.log("Username or password not provided");
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) {
        console.error('Error retrieving user from database:', err);
        return res.status(500).json({ message: 'Error retrieving user' });
      }
      if (!row) {
        console.log('User not found:', username);
        return res.status(404).json({ message: 'User not found' });
      }
  
      bcrypt.compare(password, row.password_hash, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
        if (isMatch) {
          console.log('Login successful');
          res.status(200).json({ message: 'Login successful' });
        } else {
          console.log('Invalid password for user:', username);
          res.status(401).json({ message: 'Invalid password' });
        }
      });
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

