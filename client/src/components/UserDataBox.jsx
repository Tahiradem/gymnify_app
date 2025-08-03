import "./UserDataBox.css";
import { getAuthData, storeAuthData } from "../utils/authStorage";
import { FaPen } from 'react-icons/fa';
import { useState } from 'react';
import EditModal from './EditModal';
import WeeklyExerciseModal from './WeeklyExerciseModal';
import MembershipModal from './MembershipModal';

const UserDataBox = () => {
  const { userData, gymName, email } = getAuthData();
  const [editingField, setEditingField] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  const [modalType, setModalType] = useState('default'); // 'default', 'weekly', 'membership'

   const handleEditClick = (field, value, type = 'default') => {
    setEditingField(field);
    setCurrentValue(value);
    setModalType(type);
  };

  const handleSave = async (newValue) => {
    try {
      let updatedUserData = { ...userData };
      
      // Special handling for different field types
      switch(editingField) {
        case 'medicalConditions':
          updatedUserData.medicalConditions = Array.isArray(newValue) ? newValue : [newValue];
          break;
          
        case 'exercises':
          updatedUserData.exercises = newValue;
          break;
          
        case 'membershipDetail':
          updatedUserData.membershipDetail = newValue;
          break;
          
        default:
        if (editingField.includes('.')) {
          const [parent, child] = editingField.split('.');
          updatedUserData = {
            ...updatedUserData,
            [parent]: {
              ...updatedUserData[parent],
              [child]: newValue
            }
          };
        } else {
          updatedUserData[editingField] = newValue;
        }
      }
      
      storeAuthData(email, updatedUserData, gymName);

      // Send update to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          field: editingField,
          value: newValue
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update data');
      
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    setEditingField(null);
    setCurrentValue(null);
    setModalType('default');
  };

  return (
    <div className="user_data_main_container">
      {editingField && (
        <EditModal
          field={editingField}
          currentValue={currentValue}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {editingField && modalType === 'default' && (
        <EditModal
          field={editingField}
          currentValue={currentValue}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {editingField === 'exercises' && modalType === 'weekly' && (
        <WeeklyExerciseModal
          currentExercises={currentValue}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {editingField === 'membershipDetail' && modalType === 'membership' && (
        <MembershipModal
          currentMembership={currentValue[0]}
          onSave={(newMembership) => handleSave([newMembership])}
          onClose={handleClose}
        />
      )}
      
      <div className="user_data_each_section">
        <p className="data_name_text">Weight</p>
        <p className="real_data_value_text">{userData.weight} KG</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('weight', userData.weight)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Height</p>
        <p className="real_data_value_text">{userData.height} M</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('height', userData.height)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Age</p>
        <p className="real_data_value_text">{userData.age}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('age', userData.age)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Medical Condition</p>
        <div className="medical-conditions-list">
          {userData.medicalConditions?.length > 0 ? (
            userData.medicalConditions.map((condition, index) => (
              <p key={index} className="real_data_value_text">
                {condition || "---"}
              </p>
            ))
          ) : (
            <p className="real_data_value_text">---</p>
          )}
        </div>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick(
            'medicalConditions', 
            userData.medicalConditions || [""],
            'default'
          )} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Entering Time</p>
        <p className="real_data_value_text">{userData.enteringTime}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('enteringTime', userData.enteringTime)} 
        />
      </div>
      <div className="user_data_each_section">
        <p className="data_name_text">waist size</p>
        <p className="real_data_value_text">{userData.bodyMeasurements.waistSize}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('bodyMeasurements.waistSize', userData.bodyMeasurements.waistSize)} 
        />
      </div>
      <div className="user_data_each_section">
        <p className="data_name_text">Neck size</p>
        <p className="real_data_value_text">{userData.bodyMeasurements.neckSize}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('bodyMeasurements.neckSize', userData.bodyMeasurements.neckSize)} 
        />
      </div>
      <div className="user_data_each_section">
        <p className="data_name_text">Hip size</p>
        <p className="real_data_value_text">{userData.bodyMeasurements.hipSize}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('bodyMeasurements.hipSize', userData.bodyMeasurements.hipSize)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Exercise Type</p>
        <p className="real_data_value_text">{userData.exerciseType}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('exerciseType', userData.exerciseType)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Body Fat</p>
        <p className="real_data_value_text">{userData.bodyFat}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('bodyFat', userData.bodyFat)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Fitness Goal</p>
        <p className="real_data_value_text">{userData.fitnessGoal}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('fitnessGoal', userData.fitnessGoal)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Metabolic Level</p>
        <p className="real_data_value_text">{userData.metabolicHealth}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('metabolicHealth', userData.metabolicHealth)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Activity Level</p>
        <p className="real_data_value_text">{userData.activityLevel}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('activityLevel', userData.activityLevel)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Exercise Time / Day</p>
        <p className="real_data_value_text">{userData.exerciseTimePerDay}</p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('exerciseTimePerDay', userData.exerciseTimePerDay)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Live in hot climate</p>
        <p className="real_data_value_text">
          {userData.livesInHotClimate ? 'Yes' : 'No'}
        </p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('livesInHotClimate', userData.livesInHotClimate)} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Weekly Exercise</p>
        <div className="weekly-exercise-container">
          {userData.exercises?.length > 0 ? (
              <div>
                {userData.exercises.map((exercise, index) => (
                  <ul key={index}>
                    <li className="exercise-value"><span>{getDayName(index)}</span>-{exercise || "Rest day"}</li>
                  </ul>
                ))}
              </div>
          ) : (
            <p className="real_data_value_text">No exercises set</p>
          )}
        </div>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick(
            'exercises', 
            userData.exercises || Array(7).fill(""),
            'weekly'
          )} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Supplements</p>
        <p className="real_data_value_text">
          {userData.supplements && userData.supplements[0]?.name || "---"}
        </p>
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick('supplements', 
            userData.supplements && userData.supplements[0]?.name || ""
          )} 
        />
      </div>
      
      <div className="user_data_each_section">
        <p className="data_name_text">Membership</p>
        {userData.membershipDetail?.length > 0 ? (
          <div className="membership-details">
            
            <p className="real_data_value_text">
              {userData.membershipDetail[0].price}
            </p>/
            <p className="real_data_value_text">
               {userData.membershipDetail[0].packageLength}
            </p>
          </div>
        ) : (
          <p className="real_data_value_text">No membership</p>
        )}
        <FaPen 
          className="edit_icon_for_profile" 
          onClick={() => handleEditClick(
            'membershipDetail', 
            userData.membershipDetail || [{
              planName: "",
              price: "",
              packageLength: ""
            }],
            'membership'
          )} 
        />
      </div>
    </div>
  );
};

// Helper function to get day names
const getDayName = (index) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[index] || '';
};

export default UserDataBox;