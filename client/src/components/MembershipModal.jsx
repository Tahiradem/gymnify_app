import { useState } from 'react';
import './EditModal.css';

const MembershipModal = ({ currentMembership, onSave, onClose }) => {
  const [membership, setMembership] = useState(currentMembership || {
    planName: '',
    price: '',
    packageLength: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setMembership(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(membership);
    } catch (error) {
      console.error('Error saving membership:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container membership-modal">
        <h3>Edit Membership</h3>
        <div className="membership-inputs">
          <div className="input-row">
            <label>Plan Name:</label>
            <select
              value={membership.planName}
              onChange={(e) => handleChange('planName', e.target.value)}
            >
              <option value="">Select a plan</option>
              <option value="Basic">Basic</option>
              <option value="Plus">Plus</option>
              <option value="Pro">Pro</option>
            </select>
          </div>
          
          <div className="input-row">
            <label>Duration (months):</label>
            <select
              value={membership.packageLength}
              onChange={(e) => handleChange('packageLength', e.target.value)}
            >
              <option value="">Select duration</option>
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
          
          <div className="input-row">
            <label>Price:</label>
            <input
              type="text"
              value={membership.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="Enter price"
              disabled
            />
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={isLoading || !membership.planName || !membership.packageLength}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;