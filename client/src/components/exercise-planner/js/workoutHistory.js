// Workout History Tracking System
const workoutHistory = {
    "records": [],
    "addWorkout": function(workoutData) {
        const workoutRecord = {
            date: new Date().toISOString().split('T')[0],
            day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
            exercises: workoutData.exercises,
            totalTime: workoutData.totalTime,
            totalCalories: workoutData.totalCalories,
            notes: workoutData.notes || "",
            completed: false,
            performanceRating: null,
            difficultyRating: null
        };
        
        this.records.push(workoutRecord);
        this.updateStreak();
        this.saveToLocalStorage();
        
        return workoutRecord;
    },
    "completeWorkout": function(workoutId, performance, difficulty) {
        const workout = this.records.find(w => w.id === workoutId);
        if (workout) {
            workout.completed = true;
            workout.performanceRating = performance;
            workout.difficultyRating = difficulty;
            workout.completionDate = new Date().toISOString();
            this.saveToLocalStorage();
        }
    },
    "updateStreak": function() {
        // Implementation for streak calculation
    },
    "saveToLocalStorage": function() {
        localStorage.setItem('workoutHistory', JSON.stringify(this.records));
    },
    "loadFromLocalStorage": function() {
        const savedData = localStorage.getItem('workoutHistory');
        if (savedData) {
            this.records = JSON.parse(savedData);
        }
    },
    "getLastWorkout": function() {
        return this.records.length > 0 ? this.records[this.records.length - 1] : null;
    },
    "getWorkoutByDate": function(date) {
        return this.records.find(workout => workout.date === date);
    },
    "getWeeklySummary": function() {
        // Implementation for weekly summary
    },
    "getMonthlyProgress": function() {
        // Implementation for monthly progress
    }
};

// Initialize by loading any saved data
workoutHistory.loadFromLocalStorage();