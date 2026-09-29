import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Dumbbell,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Activity,
  Heart,
  Scale,
  Ruler,
  User,
  Clock,
  Utensils,
  Target,
  RefreshCw,
} from 'lucide-react';
import { FitnessFormData, FitUser, FitnessGoal, ActivityLevel, Gender } from '../types/fitness';
import { calculateBMI } from '../utils/bmi';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

interface GeneratePlanPageProps {
  onPlanGenerated: (user: FitUser, engine?: string) => void;
}

export const GeneratePlanPage: React.FC<GeneratePlanPageProps> = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState<FitnessFormData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activity: '',
    workout_preference: 'Gym Free Weights & Machines',
    dietary_preference: 'Balanced & High-Protein',
    available_time: '45-60 mins',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Rotating progress tips while AI generates plan
  const loadingSteps = [
    'Analyzing personal biometric and metabolic markers...',
    'Consulting Gemini AI fitness reasoning models...',
    'Balancing volume, sets, and frequency for your goal...',
    'Designing targeted macronutrient and hydration targets...',
    'Formulating your customized 7-day weekly schedule...',
    'Finalizing coach recovery and progression tips...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingSteps.length]);

  const bmiData = calculateBMI(Number(formData.height), Number(formData.weight));

  const validateField = (field: keyof FitnessFormData, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Name is required.';
        }
        if (value.trim().length < 2) {
          return 'Name should be at least 2 characters.';
        }
        return '';
      case 'age':
        if (value === '' || value === undefined || value === null) {
          return 'Age is required.';
        }
        const ageNum = Number(value);
        if (isNaN(ageNum) || ageNum < 12 || ageNum > 110) {
          return 'Please enter a valid age between 12 and 110.';
        }
        return '';
      case 'gender':
        if (!value) {
          return 'Please select your gender.';
        }
        return '';
      case 'height':
        if (value === '' || value === undefined || value === null) {
          return 'Height is required.';
        }
        const hNum = Number(value);
        if (isNaN(hNum) || hNum < 80 || hNum > 250) {
          return 'Height must be between 80 and 250 cm.';
        }
        return '';
      case 'weight':
        if (value === '' || value === undefined || value === null) {
          return 'Weight is required.';
        }
        const wNum = Number(value);
        if (isNaN(wNum) || wNum < 25 || wNum > 300) {
          return 'Weight must be between 25 and 300 kg.';
        }
        return '';
      case 'goal':
        if (!value) {
          return 'Please select your primary fitness goal.';
        }
        return '';
      case 'activity':
        if (!value) {
          return 'Please select your current activity level.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: keyof FitnessFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FitnessFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrorMessage(null);

    // Validate all required fields
    const newErrors: Record<string, string> = {
      name: validateField('name', formData.name),
      age: validateField('age', formData.age),
      gender: validateField('gender', formData.gender),
      height: validateField('height', formData.height),
      weight: validateField('weight', formData.weight),
      goal: validateField('goal', formData.goal),
      activity: validateField('activity', formData.activity),
    };

    setTouched({
      name: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      goal: true,
      activity: true,
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
    if (hasErrors) {
      // Smooth scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'The AI service is temporarily busy. Please try again in a moment.');
      }

      const result = await response.json();
      onPlanGenerated(result.user, result.engine);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setApiErrorMessage(
        err.message || 'The AI service is temporarily busy. Please try again in a moment.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    setFormData({
      name: 'Alex Rivera',
      age: 26,
      gender: 'Male',
      height: 178,
      weight: 73,
      goal: 'Muscle Gain',
      activity: 'Moderate',
      workout_preference: 'Gym Free Weights & Hypertrophy',
      dietary_preference: 'High-Protein & Whole Foods',
      available_time: '45-60 mins',
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Plan Creator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Generate Your Fitness Plan
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Fill in your body metrics, fitness objectives, and routine preferences to receive an evidence-grounded AI plan.
        </p>

        {/* Demo filler button for convenient testing */}
        <div className="pt-1">
          <button
            type="button"
            onClick={loadSampleData}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200/70 transition-colors cursor-pointer"
          >
            Fill Sample Data for Testing
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {apiErrorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">Notice</h4>
            <p className="text-xs mt-0.5 leading-relaxed">{apiErrorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setApiErrorMessage(null)}
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Section 1: Personal Biometrics */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              1. Basic Information
            </h3>
            <span className="text-xs text-rose-500 font-medium ml-auto">* Required fields</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jordan Smith"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.name && touched.name
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
              {errors.name && touched.name && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Age (years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="12"
                max="110"
                placeholder="e.g. 25"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => handleBlur('age')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.age && touched.age
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
              {errors.age && touched.age && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.age}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as Gender)}
                onBlur={() => handleBlur('gender')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                  errors.gender && touched.gender
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && touched.gender && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.gender}
                </p>
              )}
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Height (cm) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="80"
                  max="250"
                  placeholder="e.g. 175"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value === '' ? '' : Number(e.target.value))}
                  onBlur={() => handleBlur('height')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors pr-10 ${
                    errors.height && touched.height
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">
                  cm
                </span>
              </div>
              {errors.height && touched.height && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.height}
                </p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Weight (kg) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="25"
                  max="300"
                  placeholder="e.g. 70"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value === '' ? '' : Number(e.target.value))}
                  onBlur={() => handleBlur('weight')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors pr-10 ${
                    errors.weight && touched.weight
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">
                  kg
                </span>
              </div>
              {errors.weight && touched.weight && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.weight}
                </p>
              )}
            </div>

            {/* BMI Live Preview Box */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Live BMI Gauge
              </label>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between min-h-[42px]">
                {bmiData ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">BMI:</span>
                      <span className="text-sm font-extrabold text-slate-900">{bmiData.bmi}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${bmiData.badgeBg}`}>
                      {bmiData.category}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">Enter height & weight</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Goals & Activity */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              2. Fitness Goal & Baseline Activity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fitness Goal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Fitness Goal <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value as FitnessGoal)}
                onBlur={() => handleBlur('goal')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                  errors.goal && touched.goal
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              >
                <option value="">Select Primary Goal</option>
                <option value="Weight Loss">Weight Loss (Caloric Deficit & Fat Burn)</option>
                <option value="Weight Gain">Weight Gain (Clean Caloric Surplus)</option>
                <option value="Muscle Gain">Muscle Gain (Hypertrophy & Strength)</option>
                <option value="General Fitness">General Fitness (Cardio, Core & Vitality)</option>
              </select>
              {errors.goal && touched.goal && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.goal}
                </p>
              )}
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Activity Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.activity}
                onChange={(e) => handleChange('activity', e.target.value as ActivityLevel)}
                onBlur={() => handleBlur('activity')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                  errors.activity && touched.activity
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              >
                <option value="">Select Activity Level</option>
                <option value="Low">Low (Sedentary, desk job, minimal intentional exercise)</option>
                <option value="Moderate">Moderate (Light active lifestyle, 1-3 workouts/week)</option>
                <option value="High">High (Demanding physical work or 4+ intense sessions/week)</option>
              </select>
              {errors.activity && touched.activity && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.activity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Optional Routine Customizations */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              3. Routine & Lifestyle Preferences
            </h3>
            <span className="text-xs text-slate-400 ml-auto font-normal">Optional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Workout Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Workout Preference
              </label>
              <input
                type="text"
                placeholder="e.g. Home Dumbbells, Gym, Calisthenics"
                value={formData.workout_preference}
                onChange={(e) => handleChange('workout_preference', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dietary Preference
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, High-Protein, Keto"
                value={formData.dietary_preference}
                onChange={(e) => handleChange('dietary_preference', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Available Workout Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Available Time per Day
              </label>
              <input
                type="text"
                placeholder="e.g. 30 mins, 45-60 mins"
                value={formData.available_time}
                onChange={(e) => handleChange('available_time', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Mandatory Disclaimer inside form */}
        <MedicalDisclaimer compact />

        {/* Submit Button & Loading State */}
        <div className="pt-2">
          {isLoading ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  FitBuddy AI is Generating Your Plan
                </h4>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  {loadingSteps[loadingStepIndex]}
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                Crafting personalized sets, reps, caloric baselines, and safety recommendations...
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>Generate Fitness Plan</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
