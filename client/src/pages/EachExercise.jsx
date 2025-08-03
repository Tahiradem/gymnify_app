import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./EachExercise.css";
import axios from 'axios';
import exercise1 from '../assets/videos/pullup.mp4';
import TotalTimeCount from '../components/TotalTimeCount';
import NavigationBar from '../components/NavigationBar';
import { getAuthData } from "../utils/authStorage";

const EachExercise = (e) => {
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [skippedExercises, setSkippedExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutActive, setWorkoutActive] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const { userData } = getAuthData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutData, setWorkoutData] = useState(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/workouts/${userData._id}/todays-data`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.data && response.data.success) {
          setWorkoutData(response.data.data);
        } else {
          setError("No workout data available");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch workout data");
      } finally {
        setLoading(false);
      }
    };

    if (userData?._id) {
      fetchWorkoutData();
    }
  }, [userData?._id]);

  useEffect(() => {
    if (userData && userData.email) {
      setUserEmail(userData.email);
    }
  }, [userData]);

   const getCurrentExercise = () => {
  if (workoutData?.workout?.exercises?.length > 0 && currentExerciseIndex < workoutData.workout.exercises.length) {
    const dbExercise = workoutData.workout.exercises[currentExerciseIndex];
    
    // Transform the path from "assets/videos/pushup.mp4" to "/videos/pushup.mp4"
    const videoPath = dbExercise.Video.replace('assets/', '/');
    // console.log(videoPath)
    
    return {
      id: currentExerciseIndex + 1,
      video: `${videoPath}`,  // Now will be "/videos/pushup.mp4"
      name: dbExercise.Exercise,
      calories: parseFloat(dbExercise.Calories) || 10,
      reps: parseInt(dbExercise.Intensity.split(' ')[0]) || 10,
      sets: parseInt(dbExercise.Intensity.match(/\((\d+) sets\)/)?.[1]) || 4,
      weight: dbExercise.Equipment === 'Bodyweight' ? 'Bodyweight' : '30 KG',
      description: dbExercise.Description || "Standard exercise description.",
      alternatives: dbExercise.Alternatives?.map(alt => alt.name) || ["Push Ups", "Arnold Press", "Lateral Raises"]
    };
  }
  return {
    id: 1,
    video: exercise1,  // Fallback to imported video
    name: "Default Exercise",
    calories: 10,
    reps: 10,
    sets: 4,
    weight: "30 KG",
    description: "Default exercise description.",
    alternatives: ["Push Ups", "Arnold Press", "Lateral Raises"]
  };
};

  const currentExercise = getCurrentExercise();
  const allExercisesCompleted = workoutData?.workout?.exercises 
    ? completedExercises.length + skippedExercises.length >= workoutData.workout.exercises.length
    : completedExercises.length + skippedExercises.length >= 1;

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    let interval;
    if (workoutActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextExercise = () => {
    setCompletedExercises(prev => [...prev, currentExercise]);
    setIsTimerRunning(false);
    setTimer(0);
    
    if (workoutData?.workout?.exercises) {
      if (currentExerciseIndex < workoutData.workout.exercises.length - 1) {
        setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      }
    }
    setIsTimerRunning(true);
  };

  const handleSkipExercise = () => {
    setSkippedExercises(prev => [...prev, currentExercise]);
    
    if (workoutData?.workout?.exercises) {
      if (currentExerciseIndex < workoutData.workout.exercises.length - 1) {
        setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      }
    }
    
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleAlternativeSelect = (altExerciseName) => {
    if (workoutData?.workout?.exercises) {
      const altIndex = workoutData.workout.exercises.findIndex(
        ex => ex.Exercise === altExerciseName
      );
      if (altIndex !== -1) {
        setCurrentExerciseIndex(altIndex);
        setShowAlternatives(false);
        setTimer(0);
        setIsTimerRunning(true);
      }
    }
  };

const handleFinishWorkout = async () => {
  setWorkoutActive(false);
  
  try {
    if (!userEmail) {
      throw new Error('User email not available');
    }

    const now = new Date();
    const timeSpentFormatted = formatTime(timeSpent);
    const connection_server = `${import.meta.env.VITE_API_BASE_URL}`
    
    const response = await axios.post(
      `${connection_server}/api/workout-time/save-workout-time`,
      {
        email: userEmail,
        date: now.toISOString(), // Send ISO string and let backend format it
        timeSpent: timeSpentFormatted
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      navigate('/report');
    } else {
      throw new Error(response.data.message || 'Failed to save workout time');
    }
  } catch (error) {
    console.error('Error saving workout time:', error.message);
    // Still navigate to report even if saving fails
    navigate('/report');
  }
};

  if (loading) {
    return <div className="loading-container">Loading workout data...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="EachExercisePage">
      <NavigationBar/>
      <div className="exercise-video-container">
        <video
          src={currentExercise.video}
          autoPlay
          loop
          muted
          className="exercise-video"
        />
        <TotalTimeCount timeSpent={timeSpent} />
      </div>
      
      <div className="top_cal_and_exercise_text">
        <p className="exercise_name">{currentExercise.name}</p>
        <p className="calorie_will_burn_text"><span>🔥</span>{currentExercise.calories} kcal</p>
      </div>
      
      <div className="repeat_Kg">
        <p className="repsXset">{currentExercise.reps} Reps . {currentExercise.sets} Set</p>
        <p className="withKilo">/{currentExercise.weight}</p>
      </div>
      
      <p className="about_this_exercise">{currentExercise.description}</p>
      
      <div className="alternative_ex_and_count">
        <button 
          className="alternative_exercise"
          onClick={() => setShowAlternatives(!showAlternatives)}
        >
          Alternative Exercise
        </button>
        <p className="count_time_for_each_exercise">{formatTime(timer)}</p>
      </div>
      
      {showAlternatives && (
        <div className="alternatives-modal">
          <h3>Alternative Exercises:</h3>
          <ul>
            {currentExercise.alternatives.map((alt, index) => (
              <li key={index} onClick={() => handleAlternativeSelect(alt)}>
                {alt}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowAlternatives(false)}>Close</button>
        </div>
      )}
      
      <div className="skip_and_next_btn">
        {!allExercisesCompleted ? (
          <>
            <button className="exercise_skip_btn button_nav" onClick={handleSkipExercise}>
              Skip
            </button>
            <button className="exercise_next_btn button_nav" onClick={handleNextExercise}>
              {workoutData?.workout?.exercises
                ? currentExerciseIndex < workoutData.workout.exercises.length - 1 
                  ? 'Next' 
                  : 'Last One'
                : 'Next'}
            </button>
          </>
        ) : (
          <button className="exercise_finish_btn" onClick={handleFinishWorkout}>
            Finish Workout
          </button>
        )}
      </div>
    </div>
  );
};

export default EachExercise;