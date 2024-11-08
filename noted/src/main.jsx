import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';
import QuizPage from './QuizPage';
import WelcomePage from './WelcomePage';
import './index.css'; // Optional for styling

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />  {/* Home page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page */}
        <Route path="/landing" element={<LandingPage />} /> {/* Landing page */}
        <Route path="/quiz" element={<QuizPage />} /> {/* Quiz page */}
        <Route path="/welcome" element={<WelcomePage />} /> {/* Welcome page */}
      </Routes>
    </Router>
  </React.StrictMode>
);
