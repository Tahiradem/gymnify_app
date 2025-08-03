import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInput from '../components/inputs/AuthInput';
import LoginButton from '../components/buttons/LoginButton';
import LoadingSpinner from '../components/loading/LoadingSpinner';
import { storeAuthData } from '../utils/authStorage';
import gymnifylogo from '../assets/Gymnify_transparent_white.png';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide intro after 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    console.log(data)

    if (!data.success) {
      setError(data.message || 'Invalid email or password');
      setIsLoading(false);
      return;
    }

    // Store auth data in sessionStorage including gymName
    storeAuthData(
      email, 
      password, 
      data.user,
      data.gymName // Add the gym name here
    );

    // Navigate to main page
    navigate('/main');
  } catch (err) {
    console.error('Login error:', err);
    setError('Failed to connect to server');
    setIsLoading(false);
  }
};

  if (showIntro) {
    return (
      <div className="intro-container">
        <img src={gymnifylogo} alt="Gymnify Logo" className="intro-logo" />
        <h1 className="intro-text">Start Today And Glow Up For Ending</h1>
      </div>
    );
  }

  return (
    <div className="login-container">
      {isLoading && <LoadingSpinner />}
      
      <img src={gymnifylogo} alt="Gymnify Logo" className="login-logo" />
      
      <form onSubmit={handleLogin} className="login-form">
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="userEmail"
          id="userEmail"
        />
        
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="userPassword"
          id="userPassword"
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <a href="/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>
        
        <LoginButton 
          onClick={handleLogin} 
          disabled={!email || !password}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
};

export default LoginPage;