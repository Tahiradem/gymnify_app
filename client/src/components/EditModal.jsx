// EditModal.jsx
import { useState, useEffect } from 'react';
import './EditModal.css';

const EditModal = ({ field, currentValue, onSave, onClose }) => {
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(value);
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputType = () => {
    if (field === 'weight' || field === 'height' || field === 'age' || field === 'waistSize' || field === 'neckSize' || field === 'hipSize') {
      return 'number';
    }
    if (field === 'livesInHotClimate') {
      return 'checkbox';
    }
    return 'text';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Edit {field}</h3>
        {getInputType() === 'checkbox' ? (
          <div className="checkbox-container">
            <input
              type="checkbox"
              id={field}
              checked={value}
              onChange={(e) => setValue(e.target.checked)}
            />
            <label htmlFor={field}>Live in hot climate</label>
          </div>
        ) : (
          <input
            type={getInputType()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter new ${field}`}
          />
        )}
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={isLoading || value === currentValue}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;