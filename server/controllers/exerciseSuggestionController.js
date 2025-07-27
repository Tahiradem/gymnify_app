const mongoose = require('mongoose');
const Gymers = require('../models/Gym');
const exerciseData = require('../data/exercises.json');

// ======================
// Utility Functions
// ======================

/**
 * Validates user profile data
 * Returns object with isValid flag and error messages
 */
function validateUserProfile(user) {
    const errors = [];
    
    // Required fields check
    const requiredFields = ['userName', 'age', 'sex', 'height', 'weight', 'activityLevel', 'fitnessGoal', 'bodyMeasurements'];
    requiredFields.forEach(field => {
        if (user[field] === undefined || user[field] === null || user[field] === '') {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Female-specific check
    if (user.sex === 'female' && (!user.bodyMeasurements.hipSize || user.bodyMeasurements.hipSize === '')) {
        errors.push('Hip size is required for female users');
    }

    // Numeric range validation
    const numericChecks = [
        { field: 'age', min: 15, max: 100 },
        { field: 'height', min: 140, max: 220 }, // in cm
        { field: 'weight', min: 40, max: 200 },  // in kg
        { field: 'bodyMeasurements.waistSize', min: 50, max: 150 }, // in cm
        { field: 'bodyMeasurements.neckSize', min: 20, max: 50 }   // in cm
    ];

    numericChecks.forEach(check => {
        const value = check.field.split('.').reduce((o, i) => o[i], user);
        if (isNaN(value) || value < check.min || value > check.max) {
            errors.push(`${check.field} must be between ${check.min}-${check.max} (current: ${value})`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Estimates hip size based on waist size for females
 * Uses average waist-to-hip ratio of 0.8
 */
function estimateHipSize(waistSize) {
    return Math.round(waistSize / 0.8);
}

/**
 * Calculates BMR using Mifflin-St Jeor Equation (more accurate)
 */
function calculateBMR(user) {
    if (user.sex === "male") {
        return (10 * user.weight) + (6.25 * user.height) - (5 * user.age) + 5;
    } else {
        return (10 * user.weight) + (6.25 * user.height) - (5 * user.age) - 161;
    }
}

/**
 * Calculates body fat percentage using Navy Body Fat formula
 * with age and gender adjustments
 */
function calculateBodyFatPercentage(user) {
    // Validate measurements first
    if (user.bodyMeasurements.waistSize <= 0 || user.bodyMeasurements.neckSize <= 0 || user.height <= 0) {
        console.error(`Invalid measurements for ${user.userName}`);
        return null;
    }

    // For females, use estimated hip size if missing
    let hipSize = user.bodyMeasurements.hipSize;
    if (user.sex === "female" && (!hipSize || isNaN(hipSize))) {
        hipSize = estimateHipSize(user.bodyMeasurements.waistSize);
        console.warn(`Estimated hip size for ${user.userName}: ${hipSize}cm`);
    }

    const log10 = (x) => Math.log(x) / Math.log(10);
    
    if (user.sex === "male") {
        if (user.bodyMeasurements.waistSize <= user.bodyMeasurements.neckSize) {
            console.error(`Waist size must be larger than neck size for ${user.userName}`);
            return null;
        }
        
        // Navy method for males
        let bodyFat = 86.010 * log10(user.bodyMeasurements.waistSize - user.bodyMeasurements.neckSize) - 70.041 * log10(user.height) + 36.76;
        
        // Age adjustment
        if (user.age > 30) {
            bodyFat += (user.age - 30) * 0.1;
        }
        return parseFloat(bodyFat.toFixed(2));
    } else {
        // Navy method for females
        let bodyFat = 163.205 * log10(user.bodyMeasurements.waistSize + Number(hipSize) - user.bodyMeasurements.neckSize) - 97.684 * log10(user.height) - 78.387;
        
        // Age adjustment
        if (user.age > 30) {
            bodyFat += (user.age - 30) * 0.07;
        }
        return parseFloat(bodyFat.toFixed(2));
    }
}

/**
 * Gets alternative exercises based on user preferences and equipment availability
 */
function getAlternativeExercises(exerciseData, targetMuscle, user) {
    // Validate inputs
    if (!exerciseData || !targetMuscle || !user) {
        console.error('Invalid parameters for getAlternativeExercises');
        return [];
    }

    // Get all exercises for the target muscle group
    const muscleGroupExercises = exerciseData[targetMuscle] || [];
    
    // Filter based on user criteria
    return muscleGroupExercises.filter(exercise => {
        // Skip the current exercise (if we're looking for alternatives to a specific one)
        if (user.currentExercise && exercise.name === user.currentExercise) {
            return false;
        }
        
        // Check equipment availability
        if (!user.hasEquipment && exercise.equipment) {
            return false;
        }
        
        // Check difficulty level
        const userLevel = user.activityLevel || 'beginner';
        const exerciseReps = exercise.activityLevels[userLevel]?.reps || 10;
        
        if (userLevel === 'beginner' && exerciseReps > 15) {
            return false; // Too difficult for beginners
        }
        
        if (userLevel === 'advanced' && exerciseReps < 8) {
            return false; // Too easy for advanced
        }
        
        return true;
    });
}

/**
 * Gets the best alternative exercises with scoring system
 */
function getBestAlternativeExercises(exerciseData, targetMuscle, user, limit = 3) {
    const alternatives = getAlternativeExercises(exerciseData, targetMuscle, user);
    
    // Score each alternative based on effectiveness and user preferences
    const scoredAlternatives = alternatives.map(exercise => {
        let score = 0;
        
        // Higher effectiveness = better
        score += exercise.effectiveness || 50;
        
        // Prefer bodyweight if no equipment
        if (!user.hasEquipment && !exercise.equipment) {
            score += 20;
        }
        
        // Match user's activity level
        const userLevel = user.activityLevel || 'beginner';
        const exerciseLevel = exercise.activityLevels[userLevel];
        if (exerciseLevel) {
            score += 10;
            
            // Bonus for being in the middle of the rep range for the level
            const repRange = exerciseLevel.reps;
            if (repRange >= 8 && repRange <= 12) {
                score += 5; // Ideal rep range for most goals
            }
        }
        
        return {
            ...exercise,
            score
        };
    });
    
    // Sort by score and limit results
    return scoredAlternatives
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Creates a workout item with calculated calories
 */
/**
 * Creates a workout item with calculated calories
 */
function createWorkoutItem(exercise, user) {
    // Add validation
    if (!exercise || !exercise.activityLevels || !user || !user.activityLevel) {
        console.error('Invalid parameters to createWorkoutItem:', { exercise, user });
        return {
            Exercise: 'Invalid exercise',
            Intensity: 'N/A',
            Calories: '0 cal',
            Equipment: 'N/A',
            Difficulty: 'N/A',
            Video: '' // Added empty video field
        };
    }

    const activityLevel = user.activityLevel;
    const levelData = exercise.activityLevels[activityLevel];
    
    if (!levelData) {
        console.error(`No activity level data for ${activityLevel} in exercise:`, exercise.name);
        return {
            Exercise: exercise.name,
            Intensity: 'N/A',
            Calories: '0 cal',
            Equipment: exercise.equipment ? "Required" : "Bodyweight",
            Difficulty: 'N/A',
            Video: exercise.video || '' // Added video field
        };
    }

    const reps = levelData.reps || 10;
    const sets = levelData.sets || 3;
    const calories = (exercise.caloriesPerRep * reps * sets).toFixed(1);
    
    return {
        Exercise: exercise.name,
        Intensity: `${reps} reps (${sets} sets)`,
        Calories: `${calories} cal`,
        Equipment: exercise.equipment ? "Required" : "Bodyweight",
        Difficulty: reps > 15 ? "Easy" : reps < 8 ? "Hard" : "Moderate",
        Video: exercise.video || '' // Added video field from exercise data
    };
}

/**
 * Generates a workout plan to meet calorie burn target
 */
function generateCalorieTargetWorkout(exercises, user, targetCalories) {
    let workoutPlan = [];
    let totalCalories = 0;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    // First pass - add each exercise once
    exercises.forEach(exercise => {
        const workoutItem = createWorkoutItem(exercise, user);
        workoutPlan.push(workoutItem);
        totalCalories += parseFloat(workoutItem.Calories);
    });
    
    // If we're still below target, repeat exercises
    while (totalCalories < targetCalories && attempts < maxAttempts) {
        attempts++;
        
        // Cycle through exercises to add variety
        exercises.forEach(exercise => {
            if (totalCalories >= targetCalories) return;
            
            const workoutItem = createWorkoutItem(exercise, user);
            workoutPlan.push(workoutItem);
            totalCalories += parseFloat(workoutItem.Calories);
        });
    }
    
    return {
        plan: workoutPlan,
        totalCalories: totalCalories.toFixed(1)
    };
}

// ======================
// Main Controller Function
// ======================

exports.generateExerciseSuggestions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid user ID format' 
            });
        }
        
        console.log(`Generating suggestions for user ${userId}`);
        
        // Fetch user data
        const gym = await Gymers.findOne({ 'users._id': userId });
        if (!gym) {
            console.error(`Gym not found for user ${userId}`);
            return res.status(404).json({ 
                success: false,
                error: 'Gym not found' 
            });
        }
        
        const user = gym.users.id(userId);
        if (!user) {
            console.error(`User ${userId} not found in gym`);
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        // Validate user profile
        const validation = validateUserProfile(user);
        if (!validation.isValid) {
            console.error(`Invalid profile for ${user.userName || 'user'}:`, validation.errors);
            return res.status(400).json({
                success: false,
                error: 'Invalid user profile',
                details: validation.errors
            });
        }

        console.log(`Processing user: ${user.userName}`, {
            activityLevel: user.activityLevel,
            fitnessGoal: user.fitnessGoal
        });

        // Calculate body composition
        const bodyFatPercentage = calculateBodyFatPercentage(user) || 15;
        const BMR = calculateBMR(user);
        
        // Calculate TDEE based on activity
        const activeDays = user.activityLevel === 'beginner' ? 2 : 
                         user.activityLevel === 'intermediate' ? 4 : 6;
        const TDEE = BMR * (activeDays <= 1 ? 1.2 : 
                    activeDays <= 3 ? 1.375 : 
                    activeDays <= 5 ? 1.55 : 1.725);
        
        // Determine calorie burn target based on goal
        let targetCalories = 200;
        if (user.fitnessGoal === "fat loss") {
            targetCalories = user.activityLevel === "beginner" ? 250 : 500;
        } else if (user.fitnessGoal === "muscle gain") {
            targetCalories = user.activityLevel === "beginner" ? 150 : 300;
        }

        // Get today's day number (0=Sunday, 1=Monday, etc.)
        const today = new Date();
        const dayNumber = today.getDay(); // JavaScript returns 0-6 (Sunday-Saturday)
        
        // Get today's target muscle from user's weekly schedule
        // Ensure exercises array has 7 elements (one for each day)
        const weeklyExercises = user.exercises && user.exercises.length === 7 ? 
                              user.exercises : 
                              ['chest', 'back', 'legs', 'shoulders', 'arms', 'cardio', 'break'];
        
        let targetMuscle = weeklyExercises[dayNumber - 1];
        
        // Handle break day or invalid muscle groups
        if (targetMuscle === 'break' || !exerciseData[targetMuscle]) {
            targetMuscle = 'full-body';
            console.log(`Today is break day or invalid target muscle, using full-body workout`);
        }

        // Get exercises for the target muscle group
        let exercises = exerciseData[targetMuscle];
        if (!exercises || exercises.length === 0) {
            exercises = [
                ...(exerciseData.chest || []).slice(0,1),
                ...(exerciseData.back || []).slice(0,1),
                ...(exerciseData.legs || []).slice(0,1)
            ];
            console.warn(`No exercises found for ${targetMuscle}. Using full-body alternatives`);
        }

        // Filter out invalid exercises
        exercises = exercises.filter(exercise => {
            if (!exercise || !exercise.name || !exercise.activityLevels) {
                console.warn('Invalid exercise found:', exercise);
                return false;
            }
            
            const hasValidLevels = Object.values(exercise.activityLevels).every(level => 
                level && typeof level.reps === 'number' && typeof level.sets === 'number'
            );
            
            if (!hasValidLevels) {
                console.warn(`Exercise ${exercise.name} has invalid activity levels`);
                return false;
            }
            
            return true;
        });

        if (exercises.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'No valid exercises found for target muscle group',
                targetMuscle
            });
        }

        // Generate workout plan to meet calorie target
        const { plan: workoutPlan, totalCalories } = generateCalorieTargetWorkout(
            exercises,
            user,
            targetCalories
        );

        // Add alternatives for each exercise
        const workoutWithAlternatives = workoutPlan.map(item => {
            const exercise = exercises.find(ex => ex.name === item.Exercise);
            const alternatives = getBestAlternativeExercises(
                exerciseData, 
                targetMuscle, 
                { 
                    ...user.toObject(), 
                    currentExercise: exercise.name,
                    hasEquipment: true
                }
            ).map(alt => ({
                name: alt.name,
                calories: `${(alt.caloriesPerRep * alt.activityLevels[user.activityLevel].reps * alt.activityLevels[user.activityLevel].sets).toFixed(1)} cal`
            }));
            
            return { ...item, Alternatives: alternatives };
        });

        // Create comprehensive result object
        const todaysData = {
            date: new Date(), // Add current date
            profile: {
                bodyFatPercentage,
                BMR,
                TDEE,
                targetCalories,
                activityLevel: user.activityLevel,
                activeDays,
                primaryGoal: user.fitnessGoal,
                bodyMeasurements: user.bodyMeasurements
            },
            workout: {
                targetMuscle,
                exercises: workoutWithAlternatives,
                totalCalories,
                targetMet: parseFloat(totalCalories) >= targetCalories,
                durationEstimate: `${Math.round(workoutWithAlternatives.length * 3.5)} minutes`,
                started: false, // Flag to track if workout has started
                completed: false // Flag to track if workout is completed
            }
        };

        // Update user's todaysData
        user.todaysData = todaysData;
        
        await gym.save();

        // Return success response
        res.json({
            success: true,
            message: 'Exercise suggestions generated and saved',
            data: todaysData
        });

    } catch (error) {
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            userId: req.params.userId,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// New controller to handle workout start
exports.startWorkout = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid user ID format' 
            });
        }
        
        // Fetch user data
        const gym = await Gymers.findOne({ 'users._id': userId });
        if (!gym) {
            return res.status(404).json({ 
                success: false,
                error: 'Gym not found' 
            });
        }
        
        const user = gym.users.id(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        // Check if todaysData exists
        if (!user.todaysData) {
            return res.status(400).json({ 
                success: false,
                error: 'No workout plan generated for today' 
            });
        }

        // Update workout status
        user.todaysData.workout.started = true;
        user.todaysData.workout.startTime = new Date();
        
        await gym.save();

        res.json({
            success: true,
            message: 'Workout started successfully',
            data: user.todaysData
        });

    } catch (error) {
        console.error('Error starting workout:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error'
        });
    }
};

// New controller to handle workout completion
exports.completeWorkout = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid user ID format' 
            });
        }
        
        // Fetch user data
        const gym = await Gymers.findOne({ 'users._id': userId });
        if (!gym) {
            return res.status(404).json({ 
                success: false,
                error: 'Gym not found' 
            });
        }
        
        const user = gym.users.id(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        // Check if todaysData exists and was started
        if (!user.todaysData || !user.todaysData.workout.started) {
            return res.status(400).json({ 
                success: false,
                error: 'Workout not started or no plan generated for today' 
            });
        }

        // Update workout status
        user.todaysData.workout.completed = true;
        user.todaysData.workout.endTime = new Date();
        
        // Calculate duration in minutes
        if (user.todaysData.workout.startTime) {
            const durationMs = new Date() - new Date(user.todaysData.workout.startTime);
            user.todaysData.workout.actualDuration = `${Math.round(durationMs / 60000)} minutes`;
        }
        
        // Add to workout history
        if (!user.workoutHistory) {
            user.workoutHistory = [];
        }
        user.workoutHistory.push(user.todaysData);
        
        await gym.save();

        res.json({
            success: true,
            message: 'Workout completed successfully',
            data: user.todaysData
        });

    } catch (error) {
        console.error('Error completing workout:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getTodaysData = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid user ID format' 
            });
        }
        
        const gym = await Gymers.findOne({ 'users._id': userId });
        if (!gym) {
            return res.status(404).json({ 
                success: false,
                error: 'Gym not found' 
            });
        }
        
        const user = gym.users.id(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        if (!user.todaysData) {
            return res.status(404).json({ 
                success: false,
                error: 'No workout data for today' 
            });
        }

        res.json({
            success: true,
            data: user.todaysData
        });

    } catch (error) {
        console.error('Error getting todays data:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error'
        });
    }
};