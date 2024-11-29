import React, { useState } from 'react';
import DragAndDropTextBox from './TextBox'; // Import the child component

const App = () => {
  const [textBoxes, setTextBoxes] = useState([
    { id: 1, text: 'Text Box 1', position: { x: 50, y: 50 }, size: { width: 150, height: 60 } },
    { id: 2, text: 'Text Box 2', position: { x: 150, y: 150 }, size: { width: 150, height: 60 } },
    { id: 3, text: 'Text Box 3', position: { x: 250, y: 250 }, size: { width: 150, height: 60 } },
  ]);

  // Function to handle adding a new text box
  const addTextBox = () => {
    const newTextBox = {
      id: textBoxes.length + 1, // Assign a new unique ID
      text: 'New Text Box', // Default text
      position: { x: 100, y: 100 }, // Default position
      size: { width: 150, height: 60 }, // Default size
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  // Function to save text box data as a JSON file
  const saveData = () => {
    const jsonData = JSON.stringify(textBoxes, null, 2); // Convert to JSON with indentation
    const blob = new Blob([jsonData], { type: 'application/json' }); // Create a Blob with the JSON data
    const url = URL.createObjectURL(blob); // Create an object URL for the Blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = url; // Set the href to the object URL
    a.download = 'text_boxes_data.json'; // Set the file name for download
    a.click(); // Programmatically trigger the download
    URL.revokeObjectURL(url); // Clean up the object URL after the download
  };

  // Function to handle loading data from a JSON file
  const loadData = (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file && file.type === 'application/json') {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const loadedData = JSON.parse(reader.result); // Parse the JSON data

          if (Array.isArray(loadedData)) {
            // Ensure the data is an array of text box objects
            setTextBoxes(loadedData);
          } else {
            alert('Invalid data format in the JSON file.');
          }
        } catch (error) {
          alert('Failed to parse JSON file. Please ensure the file is valid.');
        }
      };

      reader.readAsText(file); // Read the file as text
    } else {
      alert('Please upload a valid JSON file.');
    }
  };

  // Trigger file input click when Load Data button is clicked
  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Taskbar on the left side */}
      <div
        style={{
          width: '200px',
          backgroundColor: '#333',
          color: '#fff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          position: 'fixed',
          top: '0',
          bottom: '0',
          left: '0',
        }}
      >
        <h3>Taskbar</h3>
        <button
          onClick={addTextBox}
          style={{
            backgroundColor: '#5cb85c',
            border: 'none',
            color: 'white',
            padding: '10px',
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Add New Text Box
        </button>

        {/* Save Button */}
        <button
          onClick={saveData}
          style={{
            backgroundColor: '#0275d8',
            border: 'none',
            color: 'white',
            padding: '10px',
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Save Data
        </button>

        {/* Load Button */}
        <button
          onClick={triggerFileInput}
          style={{
            backgroundColor: '#f0ad4e',
            border: 'none',
            color: 'white',
            padding: '10px',
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Load Data
        </button>

        {/* Hidden File Input for loading JSON file */}
        <input
          type="file"
          accept=".json"
          onChange={loadData}
          style={{ display: 'none' }}
          id="file-input"
        />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: '200px', // Offset by taskbar width
          width: '100%',
          height: '100%',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <h2>Drag and Drop Text Boxes</h2>
        {/* Render the DragAndDropTextBox component */}
        <DragAndDropTextBox 
          textBoxes={textBoxes} 
          setTextBoxes={setTextBoxes} 
        />
      </div>
    </div>
  );
};

export default App;
