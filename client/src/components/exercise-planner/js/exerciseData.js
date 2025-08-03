// Exercise database organized by body parts
const exerciseDatabase = {
    "chest": [
        {
            "name": "Push Ups",
            "caloriesPerRep": 0.5,
            "image": "assets/images/pushup.jpg",
            "video": "assets/videos/pushup.mp4",
            "description": "A classic bodyweight exercise that targets the chest, shoulders, and triceps.",
            "timePerRep": 3, // seconds
            "effectiveness": 80, // percentage
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 15, "sets": 4 },
                "advanced": { "reps": 20, "sets": 5 }
            },
            "equipment": "none",
            "primaryMuscles": ["chest"],
            "secondaryMuscles": ["shoulders", "triceps"]
        },
        {
            "name": "Dumbbell Bench Press",
            "caloriesPerRep": 1.2,
            "image": "assets/images/dumbbell_bench.jpg",
            "video": "assets/videos/dumbbell_bench.mp4",
            "description": "A fundamental chest exercise using dumbbells for balanced muscle development.",
            "timePerRep": 5,
            "effectiveness": 90,
            "activityLevels": {
                "beginner": { "reps": 8, "sets": 3 },
                "intermediate": { "reps": 10, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "dumbbells",
            "primaryMuscles": ["chest"],
            "secondaryMuscles": ["shoulders", "triceps"]
        }
    ],
    "back": [
        {
            "name": "Pull Ups",
            "caloriesPerRep": 1.0,
            "image": "assets/images/pullup.jpg",
            "video": "assets/videos/pullup.mp4",
            "description": "An excellent bodyweight exercise for developing upper back strength.",
            "timePerRep": 4,
            "effectiveness": 85,
            "activityLevels": {
                "beginner": { "reps": 5, "sets": 3 },
                "intermediate": { "reps": 8, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "pull-up bar",
            "primaryMuscles": ["back"],
            "secondaryMuscles": ["biceps", "shoulders"]
        },
        {
            "name": "Bent Over Rows",
            "caloriesPerRep": 1.1,
            "image": "assets/images/bent_over_rows.jpg",
            "video": "assets/videos/bent_over_rows.mp4",
            "description": "Targets the middle back muscles with optional weights for resistance.",
            "timePerRep": 5,
            "effectiveness": 88,
            "activityLevels": {
                "beginner": { "reps": 8, "sets": 3 },
                "intermediate": { "reps": 10, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "dumbbells or barbell",
            "primaryMuscles": ["back"],
            "secondaryMuscles": ["biceps", "shoulders"]
        }
    ],
    "shoulders": [
        {
            "name": "Dumbbell Shoulder Press",
            "caloriesPerRep": 1.0,
            "image": "assets/images/shoulder_press.jpg",
            "video": "assets/videos/shoulder_press.mp4",
            "description": "Targets the deltoid muscles for shoulder strength and development.",
            "timePerRep": 5,
            "effectiveness": 85,
            "activityLevels": {
                "beginner": { "reps": 8, "sets": 3 },
                "intermediate": { "reps": 10, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "dumbbells",
            "primaryMuscles": ["shoulders"],
            "secondaryMuscles": ["triceps"]
        },
        {
            "name": "Lateral Raises",
            "caloriesPerRep": 0.8,
            "image": "assets/images/lateral_raises.jpg",
            "video": "assets/videos/lateral_raises.mp4",
            "description": "Isolates the lateral deltoids for shoulder width.",
            "timePerRep": 4,
            "effectiveness": 75,
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 12, "sets": 4 },
                "advanced": { "reps": 15, "sets": 5 }
            },
            "equipment": "dumbbells",
            "primaryMuscles": ["shoulders"],
            "secondaryMuscles": []
        }
    ],
    "legs": [
        {
            "name": "Squats",
            "caloriesPerRep": 1.5,
            "image": "assets/images/squats.jpg",
            "video": "assets/videos/squats.mp4",
            "description": "A compound exercise that targets the entire lower body.",
            "timePerRep": 6,
            "effectiveness": 95,
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 12, "sets": 4 },
                "advanced": { "reps": 15, "sets": 5 }
            },
            "equipment": "bodyweight or barbell",
            "primaryMuscles": ["quadriceps", "glutes"],
            "secondaryMuscles": ["hamstrings", "calves"]
        },
        {
            "name": "Lunges",
            "caloriesPerRep": 1.2,
            "image": "assets/images/lunges.jpg",
            "video": "assets/videos/lunges.mp4",
            "description": "Works each leg individually for balanced strength development.",
            "timePerRep": 5,
            "effectiveness": 85,
            "activityLevels": {
                "beginner": { "reps": 8, "sets": 3 },
                "intermediate": { "reps": 10, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "bodyweight or dumbbells",
            "primaryMuscles": ["quadriceps", "glutes"],
            "secondaryMuscles": ["hamstrings"]
        }
    ],
    "arms": [
        {
            "name": "Bicep Curls",
            "caloriesPerRep": 0.7,
            "image": "assets/images/bicep_curls.jpg",
            "video": "assets/videos/bicep_curls.mp4",
            "description": "Isolates the biceps for arm strength and size.",
            "timePerRep": 4,
            "effectiveness": 80,
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 12, "sets": 4 },
                "advanced": { "reps": 15, "sets": 5 }
            },
            "equipment": "dumbbells or barbell",
            "primaryMuscles": ["biceps"],
            "secondaryMuscles": []
        },
        {
            "name": "Tricep Dips",
            "caloriesPerRep": 0.8,
            "image": "assets/images/tricep_dips.jpg",
            "video": "assets/videos/tricep_dips.mp4",
            "description": "Targets the triceps using bodyweight or added resistance.",
            "timePerRep": 4,
            "effectiveness": 85,
            "activityLevels": {
                "beginner": { "reps": 8, "sets": 3 },
                "intermediate": { "reps": 10, "sets": 4 },
                "advanced": { "reps": 12, "sets": 5 }
            },
            "equipment": "parallel bars or bench",
            "primaryMuscles": ["triceps"],
            "secondaryMuscles": ["shoulders", "chest"]
        }
    ],
    "biceps": [
        {
            "name": "Hammer Curls",
            "caloriesPerRep": 0.7,
            "image": "assets/images/hammer_curls.jpg",
            "video": "assets/videos/hammer_curls.mp4",
            "description": "Works the biceps and brachialis with a neutral grip.",
            "timePerRep": 4,
            "effectiveness": 75,
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 12, "sets": 4 },
                "advanced": { "reps": 15, "sets": 5 }
            },
            "equipment": "dumbbells",
            "primaryMuscles": ["biceps"],
            "secondaryMuscles": ["forearms"]
        }
    ],
    "triceps": [
        {
            "name": "Tricep Rope Pushdown",
            "caloriesPerRep": 0.6,
            "image": "assets/images/tricep_pushdown.jpg",
            "video": "assets/videos/tricep_pushdown.mp4",
            "description": "Isolates the triceps using a cable machine.",
            "timePerRep": 4,
            "effectiveness": 80,
            "activityLevels": {
                "beginner": { "reps": 10, "sets": 3 },
                "intermediate": { "reps": 12, "sets": 4 },
                "advanced": { "reps": 15, "sets": 5 }
            },
            "equipment": "cable machine",
            "primaryMuscles": ["triceps"],
            "secondaryMuscles": []
        }
    ]
};

// Weekly workout plan template
const weeklyPlan = {
    "Monday": ["shoulders", "back"],
    "Tuesday": ["legs", "arms"],
    "Wednesday": ["biceps", "triceps"],
    "Thursday": ["chest", "shoulders"],
    "Friday": ["legs", "back"],
    "Saturday": ["arms", "core"],
    "Sunday": ["rest"]
};