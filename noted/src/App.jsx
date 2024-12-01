import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LogIn.jsx';
//import RegistrationPage from './RegistrationPage';
import HomePage from './Home.jsx';
import MyProjectsPage from './ProjectList.jsx';
import MyProject from './Project.jsx';
import Navbar from './Navbar.jsx';
import './css/styles.css'

const App = () => {
  
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/projects" element={<MyProjectsPage/>} />
          <Route path="/projects/:projectId" element={<MyProject/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
