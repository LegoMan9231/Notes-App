import React from 'react';
import { useParams } from 'react-router-dom';

const TemplatePage = () => {
  const { id } = useParams();  // Get the template ID from the URL
  
  // In a real app, you would fetch more detailed data about the template
  return (
    <div className="container mt-5">
      <h1>Template {id}</h1>
      <p>This is the detail page for template {id}.</p>
      {/* Add more content related to the template here */}
    </div>
  );
};

export default TemplatePage;
