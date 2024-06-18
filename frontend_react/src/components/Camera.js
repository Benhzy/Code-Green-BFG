// src/components/CameraComponent.js
import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './IpAdr'; 
import Loading from './LoadingPage';

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

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleTakePhoto(dataUri) {
    setIsLoading(true);
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
      setIsLoading(false);
      // Navigate to ItemsList and pass the extracted items data
      navigate('/items', { state: { items: data.extracted_text } });
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <Loading />;  // Show loading component if isLoading is true
  }

  return (
    <Camera
      onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
    />
  );
}



export default CameraComponent;

