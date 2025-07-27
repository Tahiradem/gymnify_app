const Gymers = require('../models/Gym');

// workoutController.js
exports.saveWorkoutTime = async (req, res) => {
  try {
    const { email, date, timeSpent } = req.body;

    // Validate required fields
    if (!email || !date || !timeSpent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: email, date, or timeSpent' 
      });
    }

    // Convert date to consistent format (e.g., "Monday/jun/30/2025")
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).replace(/,/g, '');

    // Update the user's spent time
    const result = await Gymers.findOneAndUpdate(
      { 'users.email': email },
      { 
        $set: { 
          [`users.$[user].spentTimeOnGym.${formattedDate}`]: timeSpent ,
          [`users.$[user].weeklyCalrieBurn`]: date
        } 
      },
      { 
        arrayFilters: [{ 'user.email': email }],
        new: true
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout time saved successfully'
    });

  } catch (error) {
    console.error('Error saving workout time:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving workout time',
      error: error.message 
    });
  }
};