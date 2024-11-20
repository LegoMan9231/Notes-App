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
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', (err, rows) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.json(rows);
  });
});

// Create a new item
app.post('/api/projects', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO projects (title) VALUES (?)', [title], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title });
  });
});

// Update an item
app.put('/api/projects/:ProjectID', (req, res) => {
  const { title } = req.body;
  const { ProjectID } = req.params;
  db.run('UPDATE projects SET title = ? WHERE ProjectID = ?', [title, ProjectID], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).json({ ProjectID, title });
  });
});

// Delete an item
app.delete('/api/projects/:ProjectID', (req, res) => {
  const { ProjectID } = req.params;
  db.run('DELETE FROM projects WHERE ProjectID = ?', [ProjectID], function(err) {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    res.status(200).send({ message: 'Item deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
