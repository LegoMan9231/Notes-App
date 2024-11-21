import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';  // Import your Homepage component
import TemplatePage from './TemplatePage';  // New component for each template page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/template/:id" element={<TemplatePage />} />
      </Routes>
    </Router>
  );
};

export default App;
