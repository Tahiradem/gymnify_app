import React from "react";
import "./ExerciseCompo.css"; // Make sure to create this CSS file
import Targeted_body_pic from "../assets/1000093564-removebg-preview.png"; // Update path as needed

const ExerciseCompo = ({ exercises }) => {
  // Exercises array now lives inside the component
  return (
    <div className="all_exercise_boxes_container">
      {exercises.map((exercises,i) => (
        <div className="Each_Exercise_box" key={i}>
          <img 
            src={Targeted_body_pic} 
            className="Exercise_img" 
            alt={exercises.name} 
          />
          <p className="Exercise_text">{exercises.Exercise}</p>
        </div>
      ))}
    </div>
  );
};

export default ExerciseCompo;