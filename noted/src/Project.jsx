import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import to capture the projectId from URL
import DragAndDropTextBox from './TextBox'; // Import the child component

const Project = () => {
  const { projectId } = useParams(); // Get projectId from the URL
  const [textBoxes, setTextBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project data and load the JSON file when the component mounts
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project data. Status: ${response.status}`);
        }
        const projectData = await response.json();
    
        console.log('Project data:', projectData); // Log project data
    
        const jsonResponse = await fetch(projectData.jsonAddress);
        if (!jsonResponse.ok) {
          throw new Error('Failed to load project data from JSON file');
        }
        const jsonData = await jsonResponse.json();
        
        setTextBoxes(jsonData.textBoxes || []);
        setLoading(false);
      } catch (err) {
        console.error('Error occurred:', err); // Log error for debugging
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  const addTextBox = () => {
    const newTextBox = {
      id: textBoxes.length + 1,
      text: 'New Text Box',
      position: { x: 100, y: 100 },
      size: { width: 150, height: 60 },
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const saveData = () => {
    const jsonData = JSON.stringify({ textBoxes }, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text_boxes_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const loadedData = JSON.parse(reader.result);
          if (Array.isArray(loadedData.textBoxes)) {
            setTextBoxes(loadedData.textBoxes);
          } else {
            alert('Invalid data format in the JSON file.');
          }
        } catch (error) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: '200px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '20px',
          position: 'fixed',
          top: '0',
          bottom: '0',
          left: '0',
        }}
      >
        <h3>Taskbar</h3>
        <button onClick={addTextBox} style={buttonStyles}>
          Add New Text Box
        </button>

        <button onClick={saveData} style={buttonStyles}>
          Save Data
        </button>

        <button onClick={triggerFileInput} style={buttonStyles}>
          Load Data
        </button>

        <input
          type="file"
          accept=".json"
          onChange={loadData}
          style={{ display: 'none' }}
          id="file-input"
        />
      </div>

      <div style={{ marginLeft: '200px', width: '100%', padding: '20px' }}>
        <DragAndDropTextBox textBoxes={textBoxes} setTextBoxes={setTextBoxes} />
      </div>
    </div>
  );
};

const buttonStyles = {
  backgroundColor: '#0275d8',
  border: 'none',
  color: 'white',
  padding: '10px',
  marginTop: '20px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default Project;
