import React from 'react';
import './ResetButton.css';

export const TopRight = ({clicked}) => {
  return (
    <button 
      className="top-right-btn"
      onClick={() => clicked()}
    >
      Reset
    </button>
  );
};

export const ResetButton = ({clicked}) => {
  return (
    <button 
      // className="top-right-btn"
      onClick={() => clicked()}
    >
      Reset
    </button>
  );
};