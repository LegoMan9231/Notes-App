// src/App.js

import React from 'react';
import AccountList from './AccountList';
import CRUD from 'noted/server/CRUD';

function App() {
  CRUD.add()
  const addItem = () => {

  }
  return (
    <div>
      <h1>Hello, Vite + React!</h1>
      <AccountList/>
      <body>
      <input type="text" id="NU" placeholder="New Username"></input>
      <input type="text" id="NP" placeholder="New Password"></input>
      <input type="text" id="NPT" placeholder="New Project Total"></input>
      <button onclick={addItem}></button>
      </body>
    </div>
  );
}


export default App;
