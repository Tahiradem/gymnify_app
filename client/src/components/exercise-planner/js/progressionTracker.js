// Exercise Progression Tracking System
const progressionTracker = {
    "userProgress": {},
    "initializeExercise": function(exerciseId) {
        if (!this.userProgress[exerciseId]) {
            this.userProgress[exerciseId] = {
                firstAttempt: new Date().toISOString(),
                lastAttempt: new Date().toISOString(),
                attempts: 0,
                bestPerformance: null,
                progressionLevel: 1,
                personalRecords: {}
            };
        }
    },
    "recordAttempt": function(exerciseId, reps, sets, weight = null) {
        this.initializeExercise(exerciseId);
        
        const exercise = this.userProgress[exerciseId];
        exercise.lastAttempt = new Date().toISOString();
        exercise.attempts++;
        
        // Check for personal records
        if (weight) {
            if (!exercise.personalRecords.maxWeight || weight > exercise.personalRecords.maxWeight) {
                exercise.personalRecords.maxWeight = weight;
                exercise.personalRecords.maxWeightDate = new Date().toISOString();
            }
        }
        
        const totalReps = reps * sets;
        if (!exercise.personalRecords.maxReps || totalReps > exercise.personalRecords.maxReps) {
            exercise.personalRecords.maxReps = totalReps;
            exercise.personalRecords.maxRepsDate = new Date().toISOString();
        }
        
        this.saveProgress();
    },
    "checkProgression": function(exerciseId) {
        const exercise = this.userProgress[exerciseId];
        if (!exercise) return false;
        
        const exerciseData = findExerciseById(exerciseId);
        if (!exerciseData || !exerciseData.progression) return false;
        
        // Check if user meets criteria to progress to next level
        const criteria = exerciseData.progression.criteria;
        const pr = exercise.personalRecords;
        
        if (criteria.includes("sets") && criteria.includes("reps")) {
            const requiredSets = parseInt(criteria.match(/sets of (\d+) reps/)[1]);
            const requiredReps = parseInt(criteria.match(/\d+/)[0]);
            
            if (pr.maxReps >= requiredSets * requiredReps) {
                return exerciseData.progression.nextLevel;
            }
        }
        
        return false;
    },
    "saveProgress": function() {
        localStorage.setItem('exerciseProgress', JSON.stringify(this.userProgress));
    },
    "loadProgress": function() {
        const savedData = localStorage.getItem('exerciseProgress');
        if (savedData) {
            this.userProgress = JSON.parse(savedData);
        }
    }
};

// Helper function to find exercise by ID
function findExerciseById(id) {
    for (const bodyPart in exerciseDatabase) {
        const exercise = exerciseDatabase[bodyPart].find(ex => ex.id === id);
        if (exercise) return exercise;
    }
    return null;
}

// Initialize by loading any saved progress
progressionTracker.loadProgress();