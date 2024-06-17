// src/components/CameraComponent.js
import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './IpAdr'; 

function CameraComponent({ userId }) {
  /* function handleTakePhoto(dataUri) {
    // Construct the URL with the user ID
    const url = `${apiUrl}/scan_receipt/${userId}`;

    // Send the captured photo to the backend
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataUri }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Extracted Text:', data.extracted_text);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  } */

  const navigate = useNavigate();

  function handleTakePhoto(dataUri) {
    const url = `${apiUrl}/upload_receipt/${userId}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataUri }),
    })
    .then(response => response.json())
    .then(data => {
      // Navigate to ItemsList and pass the extracted items data
      navigate('/items', { state: { items: data.extracted_text } });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <Camera
      onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
    />
  );
}

export default CameraComponent;

