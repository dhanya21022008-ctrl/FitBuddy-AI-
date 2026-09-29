export type Gender = 'Female' | 'Male' | 'Other';

export type FitnessGoal =
  | 'Weight Loss'
  | 'Weight Gain'
  | 'Muscle Gain'
  | 'General Fitness';

export type ActivityLevel = 'Low' | 'Moderate' | 'High';

export interface FitnessFormData {
  name: string;
  age: number | '';
  gender: Gender | '';
  height: number | ''; // in cm
  weight: number | ''; // in kg
  goal: FitnessGoal | '';
  activity: ActivityLevel | '';
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
}

export interface WorkoutExercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
}

export interface WorkoutSection {
  title: string;
  description: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  recommended_frequency: string;
  warm_up: WorkoutSection;
  main_workout: WorkoutSection;
  cool_down: WorkoutSection;
}

export interface MealSuggestion {
  meal: string;
  suggestions: string[];
}

export interface NutritionGuidance {
  general_advice: string;
  protein_sources: string[];
  fruits_and_vegetables: string[];
  hydration: string;
  meal_suggestions: MealSuggestion[];
}

export interface DaySchedule {
  day: string;
  focus: string;
  activity: string;
  duration: string;
}

export interface FitnessPlan {
  summary: string;
  daily_caloric_note?: string;
  workout_plan: WorkoutPlan;
  nutrition_guidance: NutritionGuidance;
  daily_activities: string[];
  weekly_schedule: DaySchedule[];
  fitness_tips: string[];
  progress_tracking: string[];
}

export interface FitUser {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  goal: FitnessGoal;
  activity: ActivityLevel;
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
  plan: FitnessPlan;
  is_demo?: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  weightLossCount: number;
  weightGainCount: number;
  muscleGainCount: number;
  generalFitnessCount: number;
  averageAge: number;
  averageBmi: number;
  activityBreakdown: {
    low: number;
    moderate: number;
    high: number;
  };
  recentUsers: FitUser[];
}
