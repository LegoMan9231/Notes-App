import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import to capture the projectId from URL
import DragAndDropTextBox from './TextBox'; // Import the child component

const Project = () => {
  const { projectId } = useParams(); // Get projectId from the URL
  const [textBoxes, setTextBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to decode JWT manually
  const decodeJwt = (token) => {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to view this project.');
        return;
      }

      const decodedToken = decodeJwt(token);
      if (!decodedToken || !decodedToken.userId) {
        alert('Invalid token or unauthorized access.');
        return;
      }

      const currentUserId = decodedToken.userId;

      try {
        const encodedTitle = encodeURIComponent(projectId);
        const response = await fetch(`http://localhost:5000/api/projects/${encodedTitle}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch project data. Status: ${response.status}`);
        }

        const projectData = await response.json();
        if (!projectData.UserID) {
          alert('Project data is missing UserID. Cannot verify ownership.');
          return;
        }

        if (projectData.UserID !== currentUserId) {
          alert('You are not authorized to view this project.');
          return;
        }

        // Set textboxes if available
        setTextBoxes(projectData.textBoxes || []);
        setLoading(false);
      } catch (err) {
        console.error('Error occurred:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const addTextBox = () => {
    const newTextBox = {
      id: textBoxes.length + 1,
      text: '', // Default text
      position: { x: 100, y: 100 }, // Default position
      size: { width: 150, height: 60 }, // Default size
    };
    setTextBoxes((prevTextBoxes) => [...prevTextBoxes, newTextBox]);
  };

  const saveData = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('You must be logged in to save this project.');
      return;
    }
  
    const decodedToken = decodeJwt(token);
    if (!decodedToken || !decodedToken.userId) {
      alert('Invalid token or unauthorized access.');
      return;
    }
  
    const currentUserId = decodedToken.userId;
  
    try {
      const fetchResponse = await fetch(`http://localhost:5000/api/projects/${encodeURIComponent(projectId)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        throw new Error(`Failed to fetch project data: ${errorData.message}`);
      }
  
      const projectData = await fetchResponse.json();
      if (!projectData.UserID) {
        alert('Project data is missing UserID. Cannot verify ownership.');
        return;
      }
  
      if (projectData.UserID !== currentUserId) {
        alert('You are not authorized to save this project.');
        return;
      }
  
      // Filter out blank textboxes
      const validTextBoxes = textBoxes.filter((box) => box.text && typeof box.text === 'string' && box.text.trim() !== '');
  
      const updatedProjectData = {
        title: projectData.title,
        UserID: projectData.UserID,
        textBoxes: validTextBoxes,
      };
  
      const saveResponse = await fetch(`http://localhost:5000/api/projects/save/${encodeURIComponent(projectId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProjectData),
      });
  
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => null);
        console.error('Save failed:', errorData);
        const errorMessage = errorData?.message || 'Failed to save project data. Please try again.';
        throw new Error(errorMessage);
      }
  
      const result = await saveResponse.json();
      alert(result.message);
    } catch (error) {
      console.error('Error occurred during save:', error);
      alert(`Failed to save data: ${error.message}. Check the console for more details.`);
    }
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
            // Ensure each box has the necessary properties
            const updatedTextBoxes = loadedData.textBoxes.map((box) => ({
              ...box,
              position: box.position || { x: 100, y: 100 }, // Default position
              size: box.size || { width: 150, height: 60 }, // Default size
            }));
            setTextBoxes(updatedTextBoxes);
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
        <button onClick={() => addTextBox()} style={buttonStyles}>
          Add New Text Box
        </button>

        <button onClick={() => saveData()} style={buttonStyles}>
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
