import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartGymButton.css';
import { getAuthData } from '../../utils/authStorage';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const StartGymButton = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userData } = getAuthData();

  const handleClick = async () => {
    if (!userData?._id) {
      alert('User information not available. Please log in again.');
      return;
    }

    setIsDisabled(true);
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/exercise-suggestions/${userData._id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data.success) {
        navigate('/Exercise_Review', { 
          state: { 
            workoutData: response.data.data,
            userData: {
              name: userData.userName,
              activityLevel: userData.activityLevel,
              fitnessGoal: userData.fitnessGoal
            }
          } 
        });
      } else {
        throw new Error(response.data.message || 'Failed to generate workout');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      alert(error.response?.data?.error || 'Failed to generate workout. Please try again.');
    } finally {
      setIsDisabled(false);
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`start-gym-button ${isDisabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? (
        <span className="button-text">Generating Workout...</span>
      ) : (
        <>
          <span className="button-text">Start Gym</span>
          <span className="arrow-icon">»</span>
        </>
      )}
    </button>
  );
};

export default StartGymButton;