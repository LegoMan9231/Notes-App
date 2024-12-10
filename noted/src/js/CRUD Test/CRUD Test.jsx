import React, { useState, useEffect } from 'react';
import './CRUD Test.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [updateItem, setUpdateItem] = useState({ id: null, title: ''});

  // Fetch items from the backend
  const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/api/projects');
    const data = await response.json();
    setItems(data);
  };

  // Add a new item
  const addItem = async () => {
    if (!newItem) return;
    const response = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newItem }),
    });
    const data = await response.json();
    setItems([...items, data]);
    setNewItem('');
  };

  // Update an existing item
  const updateItemHandler = async () => {
    if (!updateItem.title || !updateItem.id) return;
    const response = await fetch(`http://localhost:5000/api/projects/${updateItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: updateItem.title }),
    });
    const data = await response.json();
    setItems(items.map((item) => (item.id === data.id ? data : item)));
    setUpdateItem({ id: null, title: '' });
  };

  // Delete an item
  const deleteItem = async (id) => {
    const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
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
            value={updateItem.title}
            onChange={(e) => setUpdateItem({ ...updateItem, title: e.target.value })}
            placeholder="Update item"
          />
          <button onClick={updateItemHandler}>Update</button>
        </div>
      )}

      {/* Display Items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            #{item.id} {item.title}      
            <button onClick={() => setUpdateItem({ id: item.id, title: item.title })}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;