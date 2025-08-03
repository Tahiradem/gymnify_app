import React from 'react';
import './LoginButton.css';

const LoginButton = ({ onClick, disabled, isLoading }) => {
  return (
    <button 
      className={`login-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="loading-spiner"></div>
      ) : (
        'Login'
      )}
    </button>
  );
};

export default LoginButton;