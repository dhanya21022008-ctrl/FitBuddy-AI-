import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Users,
  Dumbbell,
  Apple,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award,
  Zap,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { calculateBMI } from '../utils/bmi';
import { NavPage } from '../components/Navbar';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
  totalUsersCount?: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, totalUsersCount = 0 }) => {
  // Quick BMI widget state on the home page for interactive delight
  const [quickHeight, setQuickHeight] = useState<number | ''>(175);
  const [quickWeight, setQuickWeight] = useState<number | ''>(70);
  const bmiResult = calculateBMI(Number(quickHeight), Number(quickWeight));

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-emerald-100/40 via-teal-100/30 to-emerald-50/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Driven Health & Athletic Planning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Your Personal <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              AI Fitness Companion
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate a personalized fitness plan based on your body details, fitness goal and activity level.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('generate')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>Generate My Fitness Plan</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('users')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Users className="w-5 h-5 text-slate-500" />
              <span>View Users</span>
              {totalUsersCount > 0 && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold ml-1">
                  {totalUsersCount}
                </span>
              )}
            </button>
          </div>

          {/* Value props badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tailored Workouts & Reps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Targeted Macro & Meal Ideas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Downloadable PDF Report</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick BMI Preview Widget */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 md:max-w-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Instant Body Metric Check</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Quick Health Indicator
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test your baseline Body Mass Index (BMI). FitBuddy uses this alongside your fitness goal and activity level to synthesize your regimen.
              </p>
            </div>

            {/* Inputs & Output */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="80"
                  max="250"
                  value={quickHeight}
                  onChange={(e) => setQuickHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  placeholder="e.g. 175"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={quickWeight}
                  onChange={(e) => setQuickWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  placeholder="e.g. 70"
                />
              </div>

              {bmiResult && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <span className="text-[11px] text-slate-500 block">BMI Score</span>
                    <span className="text-2xl font-black text-slate-900">{bmiResult.bmi}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${bmiResult.badgeBg}`}>
                      {bmiResult.category}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Ideal: {bmiResult.idealWeightRange.min}-{bmiResult.idealWeightRange.max} kg
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered For Real Fitness Results
          </h2>
          <p className="text-slate-500 text-sm">
            Everything you need to step into the gym or work out at home with complete clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform mb-5">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Full Workout Regimens
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Warm-up, targeted compound and isolation movements with sets, reps, and cooldown recovery.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform mb-5">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Nutrition Guidance
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calorie logic, optimal protein sources, hydration baselines, and practical daily meal ideas.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              7-Day Weekly Split
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Structured daily calendar balancing exertion with active recovery and restorative sleep.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Progress & Habits
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Non-scale victory metrics, step counts (NEAT), posture resets, and workout journal milestones.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              3 Simple Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How FitBuddy-AI Crafts Your Custom Plan
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 backdrop-blur-xs p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                01
              </div>
              <h4 className="font-bold text-base text-white">Enter Your Metrics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provide your age, gender, height, weight, fitness goal (Loss, Muscle, Gain, or General), and daily schedule.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-sm">
                02
              </div>
              <h4 className="font-bold text-base text-white">AI Synthesis</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemini AI computes your volume requirements, splits, and macronutrient targets within safety parameters.
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                03
              </div>
              <h4 className="font-bold text-base text-white">Export & Execute</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review your personalized blueprint, download the PDF version, print it for the gym, or save it to your profile.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Ready to begin? Takes less than 60 seconds to generate your complete roadmap.
            </p>
            <button
              onClick={() => onNavigate('generate')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Start Now — It’s Free
            </button>
          </div>
        </div>
      </section>

      {/* Mandatory Medical Disclaimer Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <MedicalDisclaimer />
      </section>
    </div>
  );
};
