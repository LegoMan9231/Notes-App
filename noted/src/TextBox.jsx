import React, { useState, useRef } from 'react';

// Draggable TextBox Component
const DraggableTextBox = ({ id, text, position, size, onMove, onEditText, onResize }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [initialMouse, setInitialMouse] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState(position);
  const [initialSize, setInitialSize] = useState(size);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text); // controlled state for text
  const textBoxRef = useRef(null);

  const handleMouseDownDrag = (e) => {
    if (resizing) return;
    setDragging(true);
    setInitialMouse({ x: e.clientX, y: e.clientY });
    setInitialPosition(position);
    e.preventDefault();
  };

  const handleMouseDownResize = (e) => {
    if (dragging) return;
    setResizing(true);
    setInitialMouse({ x: e.clientX, y: e.clientY });
    setInitialSize(size);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - initialMouse.x;
      const dy = e.clientY - initialMouse.y;
      onMove(id, { x: initialPosition.x + dx, y: initialPosition.y + dy });
    }

    if (resizing) {
      let newWidth = initialSize.width + (e.clientX - initialMouse.x);
      let newHeight = initialSize.height + (e.clientY - initialMouse.y);

      newWidth = Math.max(newWidth, 100);
      newHeight = Math.max(newHeight, 40);

      onResize(id, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleClick = () => {
    if (!dragging && !resizing) {
      setIsEditing(true);
      if (textBoxRef.current) textBoxRef.current.focus();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      onEditText(id, editableText);  // update state with the new text value
      setIsEditing(false);
    }
  };

  const handleInput = (e) => {
    // Update the editable text value as the user types
    setEditableText(e.target.innerHTML); 
  };

  React.useEffect(() => {
    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, initialMouse, initialPosition]);

  const boxStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    padding: '10px',
    margin: '5px',
    border: '1px solid black',
    backgroundColor: 'lightgray',
    cursor: dragging || resizing ? 'grabbing' : 'move',
    width: `${size.width}px`,
    height: `${size.height}px`,
    boxSizing: 'border-box',
  };

  const resizeHandleStyle = {
    position: 'absolute',
    right: '5px',
    bottom: '5px',
    width: '15px',
    height: '15px',
    backgroundColor: 'darkgray',
    cursor: 'se-resize',
  };

  return (
    <div
      style={boxStyle}
      onMouseDown={handleMouseDownDrag}
      onClick={handleClick}
    >
      <div
        ref={textBoxRef}
        contentEditable={isEditing}
        dir="ltr"
        style={{
          border: isEditing ? '1px solid blue' : 'none',
          outline: 'none',
          padding: '5px',
          minWidth: '100%',
          minHeight: '100%',
          display: 'inline-block',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          textAlign: 'left',
          lineHeight: '1.5',
          boxSizing: 'border-box',
          direction: 'ltr',  // Explicitly set text direction here
        }}
        onBlur={handleBlur}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: editableText }}  // Render editable text
      />

      <div
        style={resizeHandleStyle}
        onMouseDown={handleMouseDownResize}
      />
    </div>
  );
};

// Main Component to manage draggable text boxes
const DragAndDropTextBox = ({ textBoxes, setTextBoxes }) => {
  const moveTextBox = (id, newPosition) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === id ? { ...box, position: newPosition } : box
      )
    );
  };

  const handleEditText = (id, newText) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === id ? { ...box, text: newText } : box
      )
    );
  };

  const handleResize = (id, newSize) => {
    setTextBoxes((prevTextBoxes) =>
      prevTextBoxes.map((box) =>
        box.id === id ? { ...box, size: newSize } : box
      )
    );
  };

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      {textBoxes.map((box) => (
        <DraggableTextBox
          key={box.id}
          id={box.id}
          text={box.text}
          position={box.position}
          size={box.size}
          onMove={moveTextBox}
          onEditText={handleEditText}
          onResize={handleResize}
        />
      ))}
    </div>
  );
};

export default DragAndDropTextBox;
