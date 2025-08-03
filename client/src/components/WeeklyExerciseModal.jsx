import { useState } from 'react';
import './EditModal.css';

const WeeklyExerciseModal = ({ currentExercises, onSave, onClose }) => {
  const [exercises, setExercises] = useState(currentExercises);
  const [isLoading, setIsLoading] = useState(false);

  const handleExerciseChange = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(exercises);
    } catch (error) {
      console.error('Error saving exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container weekly-exercise-modal">
        <h3>Edit Weekly Exercises</h3>
        <div className="exercise-inputs">
          {exercises.map((exercise, index) => (
            <div key={index} className="exercise-input-row">
              <label>{getDayName(index)}:</label>
              <input
                type="text"
                value={exercise}
                onChange={(e) => handleExerciseChange(index, e.target.value)}
                placeholder="Enter exercise or leave empty for rest day"
              />
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const getDayName = (index) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[index] || '';
};

export default WeeklyExerciseModal;