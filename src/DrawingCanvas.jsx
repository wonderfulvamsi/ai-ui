import React, { useState, useRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PencilIcon from '@mui/icons-material/Create';
import EraserIcon from '@mui/icons-material/BorderColor';
import ClearIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import pencil from './pencil.png';
import eraser from './eraser.png';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (isErasing) {
      canvas.style.cursor = `url(${eraser}) 7 20, auto`; // Adjust the hotspot position
    } else {
      canvas.style.cursor = `url(${pencil}) 5 38, auto`; // Adjust the hotspot position
    }
  }, [isErasing]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    if (isErasing) {
      context.clearRect(offsetX, offsetY, 10, 10);
    } else {
      context.lineTo(offsetX, offsetY);

      // Change the line width to a larger value (e.g., 5)
      context.lineWidth = 4; // Adjust this value to set the desired line width

      context.stroke();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const clearCanvas = () => {
    context.fillStyle = 'white'; // Set background color to white
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    const tempContext = canvas.cloneNode().getContext('2d'); // Create a temporary context to prevent modifying the original
    tempContext.drawImage(canvas, 0, 0); // Copy the content to the temporary context
    const imageData = tempContext.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.id = "drawing_img_link"
    link.href = imageData;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70vh'}}>
      <div style={{ position: 'relative'}}>
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          style={{ border: '1px solid black' , backgroundColor: 'white', borderRadius: '0.5rem'}}
        />
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column' }}>
          <IconButton onClick={toggleEraser}>
            {isErasing ? <EraserIcon /> : <PencilIcon />}
          </IconButton>
          <IconButton onClick={clearCanvas}>
            <ClearIcon />
          </IconButton>
          <IconButton onClick={saveAsImage}>
            <SaveIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
