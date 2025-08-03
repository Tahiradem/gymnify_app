export const storeAuthData = (email, userData, gymName) => {
  sessionStorage.setItem('gymnify_user_email', email);
  sessionStorage.setItem('gymnify_user_data', JSON.stringify(userData));
  sessionStorage.setItem('gymnify_gym_name', gymName);
};

export const getAuthData = () => {
  return {
    email: sessionStorage.getItem('gymnify_user_email'),
    userData: JSON.parse(sessionStorage.getItem('gymnify_user_data')) || {},
    gymName: sessionStorage.getItem('gymnify_gym_name')
  };
};
export const updateUserData = async (field, value) => {
    try {
        const { userData } = getAuthData();
        const token = localStorage.getItem('token');
        
        const response = await axios.put(
            `/api/users/${userData._id}/data`,
            { field, value },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        // Update local storage if needed
        if (response.data.user) {
            const existingData = JSON.parse(localStorage.getItem('authData'));
            localStorage.setItem('authData', JSON.stringify({
                ...existingData,
                userData: response.data.user.userData
            }));
        }

        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

export const clearAuthData = () => {
  sessionStorage.removeItem('gymnify_user_email');
  sessionStorage.removeItem('gymnify_user_password');
  sessionStorage.removeItem('gymnify_user_data');
  sessionStorage.removeItem('gymnify_gym_name');
};

// Add this logout function
export const logout = () => {
  clearAuthData();
  // Optional: You might want to add other cleanup here
  // For example:
  // - Clearing any other session data
  // - Redirecting to login page (though this is better handled in the component)
  // - Any analytics tracking for logout
};