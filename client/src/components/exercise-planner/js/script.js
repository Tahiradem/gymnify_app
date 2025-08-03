// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Display current day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const dayName = days[today.getDay()];
    document.getElementById('current-day').textContent = `Today is ${dayName}`;
    
    // Display user profile
    document.getElementById('user-level').textContent = userProfile.activityLevel;
    document.getElementById('user-goal').textContent = userProfile.primaryGoal;
    document.getElementById('workout-time').textContent = userProfile.workoutDuration;
    
    // Generate workout based on today's plan
    generateWorkout(dayName);
    
    // Add event listeners
    document.getElementById('regenerate-btn').addEventListener('click', function() {
        generateWorkout(dayName);
    });
    
    document.getElementById('save-btn').addEventListener('click', function() {
        alert('Workout saved to your profile!');
    });
});

function generateWorkout(dayName) {
    // Clear previous workout
    const exercisesContainer = document.getElementById('exercises-container');
    exercisesContainer.innerHTML = '';
    
    // Get today's target body parts
    const targetBodyParts = weeklyPlan[dayName];
    
    // Display target body parts
    document.getElementById('target-body-parts').textContent = 
        `Target Body Parts: ${targetBodyParts.join(', ').toUpperCase()}`;
    
    // Don't generate workout for rest day
    if (targetBodyParts.includes('rest')) {
        exercisesContainer.innerHTML = '<p>Enjoy your rest day! Consider light stretching or mobility work.</p>';
        document.getElementById('total-time').textContent = '0';
        document.getElementById('total-calories').textContent = '0';
        return;
    }
    
    // Calculate time allocation per body part
    const timePerBodyPart = Math.floor(userProfile.workoutDuration / targetBodyParts.length);
    
    let totalTime = 0;
    let totalCalories = 0;
    
    // Generate exercises for each body part
    targetBodyParts.forEach(bodyPart => {
        // Get available exercises for this body part
        const availableExercises = exerciseDatabase[bodyPart] || [];
        
        if (availableExercises.length === 0) {
            console.warn(`No exercises found for body part: ${bodyPart}`);
            return;
        }
        
        // Filter exercises based on user's equipment
        const filteredExercises = availableExercises.filter(exercise => {
            if (!exercise.equipment || exercise.equipment === 'none') return true;
            return userProfile.availableEquipment.some(item => 
                exercise.equipment.toLowerCase().includes(item.toLowerCase())
            );
        });
        
        if (filteredExercises.length === 0) {
            console.warn(`No suitable exercises found for ${bodyPart} with available equipment`);
            return;
        }
        
        // Sort exercises by effectiveness
        filteredExercises.sort((a, b) => b.effectiveness - a.effectiveness);
        
        // Select exercises for this body part (1-3 exercises depending on time)
        const maxExercises = Math.min(3, Math.max(1, Math.floor(timePerBodyPart / 15)));
        const selectedExercises = filteredExercises.slice(0, maxExercises);
        
        // Create exercise cards
        selectedExercises.forEach(exercise => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card';
            
            // Get reps and sets based on user's activity level
            const reps = exercise.activityLevels[userProfile.activityLevel].reps;
            const sets = exercise.activityLevels[userProfile.activityLevel].sets;
            
            // Calculate time for this exercise
            const exerciseTime = Math.ceil((reps * sets * exercise.timePerRep) / 60);
            
            // Calculate calories for this exercise
            const exerciseCalories = Math.round(reps * sets * exercise.caloriesPerRep);
            
            // Update totals
            totalTime += exerciseTime;
            totalCalories += exerciseCalories;
            
            // Create exercise HTML
            exerciseCard.innerHTML = `
                <h3>${exercise.name}</h3>
                <p>${exercise.description}</p>
                <div class="exercise-details">
                    <div class="exercise-detail">
                        <strong>Body Part:</strong> ${bodyPart}
                    </div>
                    <div class="exercise-detail">
                        <strong>Sets:</strong> ${sets}
                    </div>
                    <div class="exercise-detail">
                        <strong>Reps:</strong> ${reps}
                    </div>
                    <div class="exercise-detail">
                        <strong>Time:</strong> ${exerciseTime} min
                    </div>
                    <div class="exercise-detail">
                        <strong>Calories:</strong> ~${exerciseCalories} kcal
                    </div>
                    <div class="exercise-detail">
                        <strong>Equipment:</strong> ${exercise.equipment || 'None'}
                    </div>
                </div>
            `;
            
            exercisesContainer.appendChild(exerciseCard);
        });
    });
    
    // Display totals
    document.getElementById('total-time').textContent = totalTime;
    document.getElementById('total-calories').textContent = totalCalories;
    
    // Adjust for any time discrepancies
    if (totalTime < userProfile.workoutDuration * 0.8) {
        // If we're significantly under time, suggest adding more exercises
        const timeLeft = userProfile.workoutDuration - totalTime;
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.innerHTML = `<p>You have about ${timeLeft} minutes left. Consider adding another exercise or increasing sets.</p>`;
        exercisesContainer.appendChild(suggestion);
    } else if (totalTime > userProfile.workoutDuration * 1.2) {
        // If we're over time, suggest adjustments
        const timeOver = totalTime - userProfile.workoutDuration;
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.innerHTML = `<p>This workout is about ${timeOver} minutes over your target. Consider reducing sets or choosing quicker exercises.</p>`;
        exercisesContainer.appendChild(suggestion);
    }
}