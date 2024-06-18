import React from 'react';
import './LoadingPage.css';

function Loading() {
  return (
    <div className="loading">
      <h2>Processing...</h2>
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;