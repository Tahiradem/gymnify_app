const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ID: Number,
  userName: String,
  email: String,
  password: String,
  phone: String,
  age: Number,
  sex: String,
  height: Number,
  weight: Number,
  registeredDate: String,
  paymentDate: String,
  paymentStatus: Boolean,
  exerciseTimePerDay: String,
  adminNotifications: {
    type: [String], // This ensures it's an array of strings
    default: []
  },
  healthStatus: String,
  exerciseType: String,
  enteringTime: String,
  spentTimeOnGym: {
    type: Map,
    of: String,
    default: {}
  },
  bloodType: String,
  exercises: [String],
  upComingExercise: String,
  totalTimeSpendOnGym: String,
  proteinAmountRequired: String,
  TodayNotification: String,
  activityLevel: String,
  fitnessGoal: String,
  bodyMeasurements: {
    waistSize: Number,
    neckSize: Number,
    hipSize: Number // Only required for females
  },
  weeklyCalorieBurn:{
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number,
  },
  todaysData: {
    date: { 
      type: Date, 
      default: Date.now 
    },
    profile: {
      bodyFatPercentage: Number,
      BMR: Number,
      TDEE: Number,
      targetCalories: Number,
      activityLevel: String,
      activeDays: Number,
      primaryGoal: String
    },
    workout: {
      targetMuscle: String,
      exercises: [{
        Exercise: String,
        Intensity: String,
        Calories: String,
        Equipment: String,
        Difficulty: String,
        Video:String,
        Alternatives: [{
          name: String,
          calories: String
        }]
      }],
      totalCalories: String,
      targetMet: Boolean
    }
  }
});

const weeklyDataSchema = new mongoose.Schema({
  Mon: Number,
  Tue: Number,
  Wed: Number,
  Thu: Number,
  Fri: Number,
  Sat: Number,
  Sun: Number,
  week1: {
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number
  },
  week2: {
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number
  },
  week3: {
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number
  },
  week4: {
    Mon: Number,
    Tue: Number,
    Wed: Number,
    Thu: Number,
    Fri: Number,
    Sat: Number,
    Sun: Number
  }
});

const membershipSchema = new mongoose.Schema({
  Basic: {
    "1": String,
    "2": String,
    "3": String,
    "6": String,
    "12": String,
    services: [String]
  },
  Plus: {
    "1": String,
    "2": String,
    "3": String,
    "6": String,
    "12": String,
    services: [String]
  },
  Pro: {
    "1": String,
    "2": String,
    "3": String,
    "6": String,
    "12": String,
    services: [String]
  }
});
const workoutSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  profile: {
    bodyFatPercentage: Number,
    BMR: Number,
    TDEE: Number,
    targetCalories: Number,
    activityLevel: String,
    activeDays: Number,
    primaryGoal: String
  },
  workout: {
    targetMuscle: String,
    exercises: [{
      Exercise: String,
      Intensity: String,
      Calories: String,
      Equipment: String,
      Difficulty: String,
      Alternatives: [{
        name: String,
        calories: String
      }]
    }],
    totalCalories: String,
    targetMet: Boolean
  }
});

const gymSchema = new mongoose.Schema({
  name: String,
  users: [userSchema],
  dailyIncome: [Number],
  dailyOutcome: [Number],
  dailyRevenue: Number,
  weeklyIncome: [weeklyDataSchema],
  weeklyExpense: [weeklyDataSchema],
  weeklyRevenue: [weeklyDataSchema],
  monthlyIncome: [Number],
  monthlyExpense: [Number],
  monthlyRevenue: [Number],
  email: String,
  password: String,
  phoneNumber: String,
  registeredDate: String,
  totalUsers: Number,
  currentUsers: Number,
  location: String,
  adminNotifications: {
    type: [String],
    default: [],
    get: function(notifications) {
      // Handle case where it's stored as a string
      if (typeof notifications === 'string') {
        try {
          return JSON.parse(notifications.replace(/'/g, '"'));
        } catch (e) {
          return [];
        }
      }
      return notifications;
    },
    set: function(notifications) {
      // Ensure we always store as an array
      return Array.isArray(notifications) ? notifications : [];
    }
  },
  pricePlan: Number,
  paymentsList: [String],
  accountNumbers: [String],
  payDone: Boolean,
  serviceTermination: Boolean,
  memberShip: membershipSchema,
  workoutStatistics: {
    totalWorkoutsCompleted: Number,
    averageCaloriesBurned: Number,
    mostPopularExercises: [String]
  }
});

module.exports = mongoose.model('Gymers', gymSchema);