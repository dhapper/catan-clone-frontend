import React from 'react';
import './ResetButton.css';

const TopRight = ({clicked}) => {
  return (
    <button 
      className="top-right-btn"
      onClick={() => clicked()}
    >
      Reset
    </button>
  );
};

export default TopRight;