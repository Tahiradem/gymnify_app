const Gymers = require('../models/Gym');

// Get user report data
exports.getUserReportData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the gym that contains the user
    const gym = await Gymers.findOne({ 'users._id': userId });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'User not found in any gym'
      });
    }

    // Find the specific user in the gym's users array
    const user = gym.users.find(u => u._id.toString() === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare the response data
    const responseData = {
      spentTimeOnGym: user.spentTimeOnGym,
      upComingExercise: user.upComingExercise,
      totalTimeSpendOnGym: user.totalTimeSpendOnGym,
      monthlyAttendance: user.monthlyAttendance,
      bodyMeasurements: user.bodyMeasurements,
      todaysData: user.todaysData,
      exercises: user.exercises,
      todaysData:user.todaysData,
    };

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching user report data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report data',
      error: error.message
    });
  }
};