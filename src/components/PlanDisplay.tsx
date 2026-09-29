import React, { useState } from 'react';
import {
  Download,
  Printer,
  RotateCcw,
  Users,
  Dumbbell,
  Apple,
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  Activity,
  HeartPulse,
  Award,
  ChevronRight,
  Shield,
  Layers,
  Zap,
} from 'lucide-react';
import { FitUser } from '../types/fitness';
import { calculateBMI } from '../utils/bmi';
import { downloadFitnessPlanPdf } from '../utils/pdfGenerator';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface PlanDisplayProps {
  user: FitUser;
  onGenerateAnother: () => void;
  onViewUsers: () => void;
  engineUsed?: string;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({
  user,
  onGenerateAnother,
  onViewUsers,
  engineUsed,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'workout' | 'nutrition' | 'schedule'>('all');
  const bmiData = calculateBMI(user.height, user.weight);
  const plan = user.plan;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadFitnessPlanPdf(user);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                FitBuddy AI Generated
              </span>
              {user.is_demo && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Demo Profile
                </span>
              )}
              {engineUsed && (
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {engineUsed}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Your Personalized FitBuddy Plan
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Customized athletic roadmap designed exclusively for <span className="font-semibold text-slate-800">{user.name}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Plan (PDF)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Print this fitness plan"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Print Plan</span>
            </button>
            <button
              onClick={onGenerateAnother}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Generate Another</span>
            </button>
            <button
              onClick={onViewUsers}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>All Users</span>
            </button>
          </div>
        </div>

        {/* User Metrics Profile Card */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Athlete Name</span>
              <span className="text-sm font-bold text-slate-800 truncate block mt-0.5">{user.name}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Age & Gender</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">
                {user.age} yrs • {user.gender}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Height & Weight</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">
                {user.height} cm • {user.weight} kg
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Fitness Goal</span>
              <span className="text-sm font-bold text-emerald-700 truncate block mt-0.5">
                {user.goal}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Activity Level</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">
                {user.activity}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Calculated BMI</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">{bmiData?.bmi}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${bmiData?.badgeBg}`}>
                  {bmiData?.category}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Preferences Row */}
          {(user.workout_preference || user.dietary_preference || user.available_time) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">Preferences:</span>
              {user.workout_preference && (
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  🏋️ {user.workout_preference}
                </span>
              )}
              {user.dietary_preference && (
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  🥗 {user.dietary_preference}
                </span>
              )}
              {user.available_time && (
                <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  ⏱️ {user.available_time}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Filter for Desktop (Hidden in Print) */}
      <div className="flex items-center gap-1 border-b border-slate-200 print:hidden overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Full Fitness Plan', icon: Layers },
          { id: 'workout', label: 'Workout Regimen', icon: Dumbbell },
          { id: 'nutrition', label: 'Nutrition & Meals', icon: Apple },
          { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-emerald-600 text-emerald-800 bg-emerald-50/50 font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Personalized Summary Card */}
      {(activeTab === 'all' || activeTab === 'workout') && (
        <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>1. Personalized Plan Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-3">
              Strategic Blueprint for {user.goal}
            </h2>
            <p className="text-emerald-50/90 text-sm sm:text-base leading-relaxed">
              {plan.summary}
            </p>

            <div className="mt-6 pt-5 border-t border-emerald-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2.5 bg-emerald-800/40 backdrop-blur-xs p-3 rounded-xl border border-emerald-700/50">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-emerald-200/70 block">Target Frequency</span>
                  <span className="font-bold text-white text-sm">
                    {plan.workout_plan?.recommended_frequency || '3-4 Days / Week'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-800/40 backdrop-blur-xs p-3 rounded-xl border border-emerald-700/50">
                <Droplets className="w-4 h-4 text-cyan-300 shrink-0" />
                <div>
                  <span className="text-emerald-200/70 block">Hydration Target</span>
                  <span className="font-bold text-white text-sm">2.5 - 3.5 Liters Daily</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-800/40 backdrop-blur-xs p-3 rounded-xl border border-emerald-700/50">
                <Flame className="w-4 h-4 text-amber-300 shrink-0" />
                <div>
                  <span className="text-emerald-200/70 block">Primary Focus</span>
                  <span className="font-bold text-white text-sm">{user.goal}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Workout Plan Section */}
      {(activeTab === 'all' || activeTab === 'workout') && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  2. Structured Workout Regimen
                </h3>
                <p className="text-xs text-slate-500">
                  Recommended cadence: <span className="font-semibold text-emerald-700">{plan.workout_plan?.recommended_frequency}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {user.available_time || '30-45 mins per session'}
            </span>
          </div>

          {/* Phase 1: Warm-up */}
          {plan.workout_plan?.warm_up && (
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center text-xs font-black">
                  A
                </span>
                <h4>Warm-Up Routine: {plan.workout_plan.warm_up.title}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3.5 pl-8">
                {plan.workout_plan.warm_up.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pl-8">
                {plan.workout_plan.warm_up.exercises.map((ex, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-800">{ex.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      {ex.duration && <span className="text-emerald-700 font-medium">⏱️ {ex.duration}</span>}
                      {ex.notes && <span className="italic">{ex.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 2: Main Workout */}
          {plan.workout_plan?.main_workout && (
            <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-200/70">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-base mb-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                  B
                </span>
                <h4>Main Workout: {plan.workout_plan.main_workout.title}</h4>
              </div>
              <p className="text-xs text-emerald-800/80 mb-4 pl-8">
                {plan.workout_plan.main_workout.description}
              </p>

              <div className="space-y-2.5 pl-8">
                {plan.workout_plan.main_workout.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{ex.name}</h5>
                        {ex.notes && (
                          <p className="text-xs text-slate-500 mt-0.5">{ex.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs font-semibold">
                      {ex.sets && (
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {ex.sets} Sets
                        </span>
                      )}
                      {ex.reps && (
                        <span className="bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
                          {ex.reps} Reps
                        </span>
                      )}
                      {ex.duration && (
                        <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                          {ex.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 3: Cool-down */}
          {plan.workout_plan?.cool_down && (
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/70">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
                <span className="w-6 h-6 rounded-lg bg-teal-200 text-teal-900 flex items-center justify-center text-xs font-black">
                  C
                </span>
                <h4>Cool-Down & Recovery: {plan.workout_plan.cool_down.title}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3 pl-8">
                {plan.workout_plan.cool_down.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                {plan.workout_plan.cool_down.exercises.map((ex, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-800">{ex.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      {ex.duration && <span className="text-teal-700 font-medium">⏱️ {ex.duration}</span>}
                      {ex.notes && <span>{ex.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. Nutrition Guidance Section */}
      {(activeTab === 'all' || activeTab === 'nutrition') && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                3. Nutrition Guidance & Meal Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated to support {user.goal} and {user.dietary_preference || 'Balanced Eating'}
              </p>
            </div>
          </div>

          <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-200/70 text-sm text-teal-950 leading-relaxed">
            <strong className="font-semibold block mb-1">Nutrition Strategy:</strong>
            {plan.nutrition_guidance?.general_advice}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protein Sources */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Target Protein Sources
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {plan.nutrition_guidance?.protein_sources.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Produce & Complex Carbs */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Fruits & Vegetables
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {plan.nutrition_guidance?.fruits_and_vegetables.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hydration */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Hydration Target
                </h4>
                <div className="bg-white p-3.5 rounded-xl border border-cyan-100 text-xs text-slate-700 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-cyan-700 font-bold">
                    <Droplets className="w-4 h-4" />
                    <span>Daily Water Baseline</span>
                  </div>
                  <p className="leading-relaxed">{plan.nutrition_guidance?.hydration}</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400 bg-white/70 p-2.5 rounded-lg border border-slate-100">
                Tip: Sip water steadily throughout the day rather than chugging large amounts at once.
              </div>
            </div>
          </div>

          {/* Sample Daily Meals */}
          {plan.nutrition_guidance?.meal_suggestions?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-800">Sample Meal Ideas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {plan.nutrition_guidance.meal_suggestions.map((meal, i) => (
                  <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block mb-2 pb-1 border-b border-slate-200">
                      {meal.meal}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {meal.suggestions.map((sug, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Daily Activities & Habits */}
      {(activeTab === 'all' || activeTab === 'workout') && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                4. Daily Activity & Lifestyle Habits (NEAT)
              </h3>
              <p className="text-xs text-slate-500">
                Non-Exercise Activity Thermogenesis and daily restorative routines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {plan.daily_activities?.map((activity, i) => (
              <div
                key={i}
                className="bg-amber-50/30 rounded-2xl p-4 border border-amber-200/60 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Weekly Schedule Breakdown */}
      {(activeTab === 'all' || activeTab === 'schedule') && (
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                5. Weekly Fitness Schedule
              </h3>
              <p className="text-xs text-slate-500">
                7-day balanced distribution of training, active recovery, and deep rest
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {plan.weekly_schedule?.map((item, idx) => {
              const isRest = item.focus.toLowerCase().includes('rest') || item.focus.toLowerCase().includes('recovery');
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                    isRest
                      ? 'bg-slate-50/80 border-slate-200 text-slate-700'
                      : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950 shadow-2xs hover:shadow-sm'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider block text-slate-500">
                      {item.day}
                    </span>
                    <span
                      className={`text-xs font-bold block mt-1 ${
                        isRest ? 'text-slate-700' : 'text-emerald-800'
                      }`}
                    >
                      {item.focus}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      {item.activity}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6 & 7. Coaching Tips & Progress Tracking */}
      {(activeTab === 'all' || activeTab === 'workout') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Fitness Tips */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                6. FitBuddy Coach Tips
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {plan.fitness_tips?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Progress Tracking Suggestions */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                7. Progress Tracking Milestones
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {plan.progress_tracking?.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Award className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* Visible Mandatory Disclaimer */}
      <MedicalDisclaimer />

      {/* Bottom Sticky Action Bar for Mobile & Quick Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          Saved in database for <strong className="text-slate-800">{user.name}</strong> on{' '}
          {new Date(user.created_at).toLocaleDateString()}.
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={onGenerateAnother}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
