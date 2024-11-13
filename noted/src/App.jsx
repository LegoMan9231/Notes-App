import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [updateItem, setUpdateItem] = useState({ id: null, username: '', password: '', project_total: null });

  // Fetch items from the backend
  const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/api/accounts');
    const data = await response.json();
    setItems(data);
  };

  // Add a new item
  const addItem = async () => {
    if (!newItem) return;
    const response = await fetch('http://localhost:5000/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newItem }),
    });
    const data = await response.json();
    setItems([...items, data]);
    setNewItem('');
  };

  // Update an existing item
  const updateItemHandler = async () => {
    if (!updateItem.username || !updateItem.id) return;
    const response = await fetch(`http://localhost:5000/api/accounts/${updateItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: updateItem.username }),
    });
    const data = await response.json();
    setItems(items.map((item) => (item.id === data.id ? data : item)));
    setUpdateItem({ id: null, username: '' });
  };

  // Delete an item
  const deleteItem = async (id) => {
    const response = await fetch(`http://localhost:5000/api/accounts/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      <h1>CRUD Operations on SQLite Database</h1>

      {/* Add Item */}
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={addItem}>Add</button>
      </div>

      {/* Update Item */}
      {updateItem.id && (
        <div>
          <input
            type="text"
            value={updateItem.username}
            onChange={(e) => setUpdateItem({ ...updateItem, username: e.target.value })}
            placeholder="Update item"
          />
          <input
            type="text"
            value={updateItem.password}
            onChange={(e) => setUpdateItem({ ...updateItem, password: e.target.value })}
            placeholder="Update item"
          />
          <input
            type="text"
            value={updateItem.project_total}
            onChange={(e) => setUpdateItem({ ...updateItem, project_total: e.target.value })}
            placeholder="Update item"
          />
          <button onClick={updateItemHandler}>Update</button>
        </div>
      )}

      {/* Display Items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            #{item.id} {item.username}      
            <button onClick={() => setUpdateItem({ id: item.id, username: item.username })}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;