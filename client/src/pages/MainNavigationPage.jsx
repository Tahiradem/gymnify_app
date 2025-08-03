import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainNavigationPage.css';
import NavigationBar from '../components/NavigationBar';
import StartGymButton from '../components/buttons/StartGymButton';
import MeasurmentAlert from '../components/MeasurmentAlert';
import { storeAuthData, getAuthData } from '../utils/authStorage';

const MainNavigationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [gymName, setGymName] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email')

  
useEffect(() => {
  // Only load eruda on mobile or for debugging
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  script.onload = () => window.eruda && window.eruda.init();
  document.body.appendChild(script);
}, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      // sessionStorage.setItem('gymnify_user_email', email);
      // const email = sessionStorage.getItem('gymnify_user_email') || "at0614@gmail.com";
      console.log(email)
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.message || 'Invalid email or password');
          setIsLoading(false);
          return;
        }

        // Store auth data in sessionStorage including gymName
        storeAuthData(
          email, 
          data.userData,
          data.gymName
        );

        // Set local state
        setGymName(data.gymName);
        setUserData(data.userData);
      } catch (err) {
        console.error('Login error:', err);
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="main-container_navigation">
      <NavigationBar />
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <h1 className='gymHouseName_navigator_page'>{gymName || 'Your Gym House'}</h1>
          <h1 className='welcome_text'>Welcome, {userData?.userName || 'User'}!</h1>
          {userData?.qrCode && (
            <div className="qr-code-container-entrance">
              <img 
                src={userData.qrCode} 
                alt="Membership QR Code" 
                className="qr-code-image-entrance"
              />
              <p className="qr-code-instructions-entrance">
                Show this QR code at the gym entrance or use your card and start your workout!
              </p>
            </div>
          )}
          <div className="start-gym-button-container">
            <StartGymButton />
          </div>
        </>
      )}
    </div>
  );
};

export default MainNavigationPage;
