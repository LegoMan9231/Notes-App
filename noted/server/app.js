// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
    });

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Get all items
app.get('/api/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', (err, rows) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.json(rows);
  });
});

// Create a new item
app.post('/api/accounts', (req, res) => {
  const { username } = req.body;
  db.run('INSERT INTO accounts (username) VALUES (?)', [username], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, username });
  });
});

// Update an item
app.put('/api/accounts/:id', (req, res) => {
  const { username } = req.body;
  const { id } = req.params;
  db.run('UPDATE accounts SET username = ? WHERE id = ?', [username, id], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).json({ id, username });
  });
});

// Delete an item
app.delete('/api/accounts/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM accounts WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).send({ message: 'Item deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
