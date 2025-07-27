const Gymers = require('../models/Gym');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const gym = await Gymers.findOne({
      'users': {
        $elemMatch: {
          email: email,
          password: password
        }
      }
    });

    if (!gym) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = gym.users.find(u => u.email === email && u.password === password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user,
      gymId: gym._id,
      gymName: gym.name // Include the gym name in the response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};
exports.updateUserData = async (req, res) => {
  try {
    const { email, field, value } = req.body;

    // Find the gym that contains the user
    const gym = await Gymers.findOne({
      'users.email': email
    });

    if (!gym) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update the specific field for the user
    const updateQuery = {};
    updateQuery[`users.$.${field}`] = value;

    await Gymers.updateOne(
      { 'users.email': email },
      { $set: updateQuery }
    );

    res.status(200).json({
      success: true,
      message: 'User data updated successfully'
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during update' 
    });
  }
};