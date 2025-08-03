import "./ExercisePage.css";
import NavigationBar from "../components/NavigationBar";
import imageTop from "../assets/photo-1728486144678-95cb7c5f7463.jpeg";
import Targeted_body_pic from "../assets/1000093564-removebg-preview.png";
import ExerciseCompo from "../components/ExerciseCompo";
import { getAuthData } from "../utils/authStorage";
import StartExerciseButton from "../components/buttons/StartExercise";
import { FaArrowLeft } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ExercisePage = () => {
  const { userData } = getAuthData();
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();
  const dayNumber = (today.getDay() + 6) % 7;

  const connection_server = `${import.meta.env.VITE_API_BASE_URL}`

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        // Make sure to use the correct API endpoint
        const response = await axios.get(
          `${connection_server}/api/workouts/${userData._id}/todays-data`,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log("API Response Data:", response.data);
        
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

    fetchWorkoutData();
  }, [userData._id]);

  if (loading) {
    return <div className="loading">Loading workout data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Fallback to user's exercise schedule if no API data
  const targetMuscle = workoutData?.workout?.targetMuscle || userData.exercises[dayNumber] || "full-body";
  const calorieBurn = workoutData?.workout?.totalCalories || "100 cal";
  const exerciseCount = workoutData?.workout?.exercises?.length || 1;
  const exercises = workoutData?.workout?.exercises || [];

  return (
    <div className="exercise-page">
      <NavigationBar />
      <img src={imageTop} className="imageTop" alt="Exercise banner" />
      <a className="back_into_navigator_page">
        <FaArrowLeft className="back_into_navigator_page" />
      </a>
      <div className="exercise_main_continer">
        <div className="Top_about_exercise">
          <span className="Day_and_text_exercise">
            <h1>{userData.monthlyAttendance[1]?.daysAttended || 0} Days</h1>
            <h2>{targetMuscle}</h2>
          </span>
          <img 
            src={Targeted_body_pic} 
            className="image_targeted_exercise" 
            alt="Targeted muscles" 
          />
        </div>
        <div className="Tagrgeted_things_container">
          <div className="targeted_weight">
            <p>Difficulty</p>
            <p>{workoutData?.workout?.exercises[0].Difficulty || "Mode"}</p>
          </div>
          <div className="targeted_calorie_burn">
            <p>Calorie will burn</p>
            <p>{calorieBurn}</p>
          </div>
        </div>
        <div className="middle_container_exercise">
          <p className="how_much_exercise_txt">{exerciseCount} exercises</p>
          <StartExerciseButton 
            workoutStarted={workoutData?.workout?.started || false}
            userId={userData._id}
          />
        </div>
        <ExerciseCompo exercises={exercises} />
      </div>
    </div>
  );
};

export default ExercisePage;