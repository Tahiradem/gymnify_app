const test_content = document.querySelector('.test_content');

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
    const requiredFields = ['name', 'age', 'gender', 'height', 'weight', 'activityLevel', 'primaryGoal', 'waistSize', 'neckSize'];
    requiredFields.forEach(field => {
        if (user[field] === undefined || user[field] === null || user[field] === '') {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Female-specific check
    if (user.gender === 'female' && (user.hipSize === undefined || user.hipSize === null || user.hipSize === '')) {
        errors.push('Hip size is required for female users');
    }

    // Numeric range validation
    const numericChecks = [
        { field: 'age', min: 15, max: 100 },
        { field: 'height', min: 140, max: 220 }, // in cm
        { field: 'weight', min: 40, max: 200 },  // in kg
        { field: 'waistSize', min: 50, max: 150 }, // in cm
        { field: 'neckSize', min: 20, max: 50 }   // in cm
    ];

    numericChecks.forEach(check => {
        const value = user[check.field];
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

// ======================
// Body Composition Calculations
// ======================

/**
 * Calculates BMR using Mifflin-St Jeor Equation (more accurate)
 */
function calculateBMR(user) {
    if (user.gender === "male") {
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
    if (user.waistSize <= 0 || user.neckSize <= 0 || user.height <= 0) {
        console.error(`Invalid measurements for ${user.name}`);
        return null;
    }

    // For females, use estimated hip size if missing
    let hipSize = user.hipSize;
    if (user.gender === "female" && (!hipSize || isNaN(hipSize))) {
        hipSize = estimateHipSize(user.waistSize);
        console.warn(`Estimated hip size for ${user.name}: ${hipSize}cm`);
    }

    const log10 = (x) => Math.log(x) / Math.log(10);
    
    if (user.gender === "male") {
        if (user.waistSize <= user.neckSize) {
            console.error(`Waist size must be larger than neck size for ${user.name}`);
            return null;
        }
        
        // Navy method for males
        let bodyFat = 86.010 * log10(user.waistSize - user.neckSize) - 70.041 * log10(user.height) + 36.76;
        
        // Age adjustment
        if (user.age > 30) {
            bodyFat += (user.age - 30) * 0.1;
        }
        return bodyFat.toFixed(2);
    } else {
        // Navy method for females
        let bodyFat = 163.205 * log10(user.waistSize + Number(hipSize) - user.neckSize) - 97.684 * log10(user.height) - 78.387;
        
        // Age adjustment
        if (user.age > 30) {
            bodyFat += (user.age - 30) * 0.07;
        }
        return bodyFat.toFixed(2);
    }
}

// ======================
// Exercise Calculations
// ======================

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
 * Adjusts reps based on user progress from history
 */
function getProgressiveReps(exercise, user, history) {
    if (!exercise || !user || !history) {
        console.error('Invalid parameters for getProgressiveReps');
        return '8-10 reps (3 sets)'; // Default fallback
    }

    const baseReps = exercise.activityLevels[user.activityLevel]?.reps || 10;
    const baseSets = exercise.activityLevels[user.activityLevel]?.sets || 3;
    
    // Check if user has done this exercise before
    const previousAttempts = history.filter(entry => 
        entry.exerciseName === exercise.name
    ).slice(-3); // Look at last 3 attempts
    
    if (previousAttempts.length === 0) {
        // First time - use base recommendation
        return `${baseReps}-${baseReps + 2} reps (${baseSets} sets)`;
    }
    
    // Calculate average performance
    const avgPerformance = previousAttempts.reduce((sum, attempt) => {
        return sum + (attempt.completedReps / attempt.targetReps);
    }, 0) / previousAttempts.length;
    
    // Adjust reps based on performance
    let adjustedReps = baseReps;
    if (avgPerformance > 0.9) {
        // User is excelling - increase difficulty
        adjustedReps = Math.min(baseReps + 2, baseReps * 1.2);
    } else if (avgPerformance < 0.7) {
        // User struggling - decrease difficulty
        adjustedReps = Math.max(baseReps - 2, baseReps * 0.8);
    }
    
    return `${Math.round(adjustedReps)}-${Math.round(adjustedReps) + 2} reps (${baseSets} sets)`;
}

/**
 * Calculates total calories burned for a workout
 */
function calculateWorkoutCalories(workoutPlan) {
    return workoutPlan.reduce((total, exercise) => {
        const caloriesMatch = exercise.Calories.match(/(\d+\.?\d*)/);
        if (caloriesMatch) {
            return total + parseFloat(caloriesMatch[0]);
        }
        return total;
    }, 0);
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

/**
 * Creates a workout item with calculated calories
 */
function createWorkoutItem(exercise, user) {
    const reps = exercise.activityLevels[user.activityLevel].reps;
    const sets = exercise.activityLevels[user.activityLevel].sets;
    const calories = (exercise.caloriesPerRep * reps * sets).toFixed(1);
    
    return {
        Exercise: exercise.name,
        Intensity: `${reps} reps (${sets} sets)`,
        Calories: `${calories} cal`,
        Equipment: exercise.equipment ? "Required" : "Bodyweight",
        Difficulty: reps > 15 ? "Easy" : reps < 8 ? "Hard" : "Moderate"
    };
}

// ======================
// Main Function
// ======================

async function loadJSON() {
    try {
        const [exercisesData, usersData] = await Promise.all([
            fetch('exercises.json'),
            fetch('userData.json')
        ]);

        if (!exercisesData.ok || !usersData.ok) {
            throw new Error('Failed to load data');
        }

        const exerciseData = await exercisesData.json();
        const userData = await usersData.json();
        
        // Array to store all results
        const allResults = [];
        
        userData.forEach((user) => {
            // Validate user profile first
            const validation = validateUserProfile(user);
            if (!validation.isValid) {
                console.error(`Invalid profile for ${user.name || 'user'}:`, validation.errors);
                allResults.push({
                    user: user.name || 'Unknown',
                    error: `Invalid profile: ${validation.errors.join(', ')}`
                });
                return;
            }

            // Calculate body composition
            const bodyFatPercentage = calculateBodyFatPercentage(user) || 15;
            const BMR = calculateBMR(user);
            
            // Calculate TDEE based on activity
            const activeDays = user.weekExercises.filter(status => status === "active").length;
            const TDEE = BMR * (() => {
                if (activeDays <= 1) return 1.2;
                if (activeDays <= 3) return 1.375;
                if (activeDays <= 5) return 1.55;
                if (activeDays === 6) return 1.725;
                return 1.9;
            })();
            
            // Determine calorie burn target based on goal
            let targetCalories = 0;
            const goal = user.primaryGoal.toLowerCase();
            
            if (goal === "fat loss") {
                targetCalories = user.activityLevel === "beginner" ? 250 : 500;
            } else if (goal === "muscle gain") {
                targetCalories = user.activityLevel === "beginner" ? 150 : 300;
            } else {
                targetCalories = 200; // Maintenance
            }

            // Handle exercise selection
            let targetMuscle = user.todaysExercise;
            if (!exerciseData[targetMuscle]) {
                console.warn(`Invalid exercise focus: ${targetMuscle}. Defaulting to full-body`);
                targetMuscle = 'full-body';
            }

            // Get exercises for today
            let exercises = exerciseData[targetMuscle];
            if (!exercises || exercises.length === 0) {
                exercises = [
                    ...(exerciseData.chest || []).slice(0,1),
                    ...(exerciseData.back || []).slice(0,1),
                    ...(exerciseData.legs || []).slice(0,1)
                ];
                console.warn(`No exercises found for ${targetMuscle}. Using full-body alternatives`);
            }

            // Generate workout plan to meet calorie target
            const { plan: workoutPlan, totalCalories } = generateCalorieTargetWorkout(
                exercises,
                user,
                targetCalories
            );

            // Get alternatives for each exercise
            const workoutWithAlternatives = workoutPlan.map(item => {
                const exercise = exercises.find(ex => ex.name === item.Exercise);
                const alternatives = getBestAlternativeExercises(
                    exerciseData, 
                    targetMuscle, 
                    { ...user, currentExercise: exercise.name }
                ).map(alt => ({
                    name: alt.name,
                    calories: `${(alt.caloriesPerRep * alt.activityLevels[user.activityLevel].reps * alt.activityLevels[user.activityLevel].sets).toFixed(1)} cal`
                }));
                
                return {
                    ...item,
                    Alternatives: alternatives
                };
            });

            // Create result object for this user
            const userResult = {
                user: user.name,
                profile: {
                    bodyFatPercentage,
                    BMR,
                    TDEE,
                    targetCalories,
                    activityLevel: user.activityLevel,
                    activeDays,
                    primaryGoal: user.primaryGoal
                },
                workout: {
                    targetMuscle,
                    exercises: workoutWithAlternatives,
                    totalCalories,
                    targetMet: parseFloat(totalCalories) >= targetCalories
                }
            };

            // Add to all results
            allResults.push(userResult);
        });

        // Log all results at once
        console.log('=== ALL WORKOUT RESULTS ===');
        console.log(allResults);
        
        // Return the results for further use
        return allResults;

    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Execute and handle the results
loadJSON().then(results => {
    // You can access the complete results array here
    console.log('Total users processed:', results.length);
    
    // Example: Filter successful workouts
    const successfulWorkouts = results.filter(result => !result.error && result.workout.targetMet);
    console.log('Successful workouts:', successfulWorkouts.length);
    
    // Example: Find users who didn't meet their targets
    const unmetTargets = results.filter(result => !result.error && !result.workout.targetMet);
    console.log('Unmet targets:', unmetTargets.length);
});