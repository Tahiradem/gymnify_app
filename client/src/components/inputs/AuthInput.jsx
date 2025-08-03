import React from 'react';
import './AuthInput.css';

const AuthInput = ({ type, placeholder, value, onChange, name, id }) => {
  return (
    <input
      type={type}
      className="auth-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      required
    />
  );
};

export default AuthInput;