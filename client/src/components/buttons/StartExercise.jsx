import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartExercise.css';
import TotalTimeCount from "../../components/TotalTimeCount"

const StartExerciseButton = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsDisabled(true);
    setIsCounting(true);
    navigate('/Exercise');
  };

  return (
    <div className="exercise-container">
      <button 
        className={`start-exercise-button ${isDisabled ? 'disabled' : ''}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <span className="button-text">Start Now</span>
        <span className="arrow-icon">»</span>
      </button>
    </div>
  );
};

export default StartExerciseButton;