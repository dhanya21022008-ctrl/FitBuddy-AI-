import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  TrendingDown,
  TrendingUp,
  Dumbbell,
  Activity,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  PlusCircle,
  Award,
} from 'lucide-react';
import { DashboardStats, FitUser } from '../types/fitness';
import { NavPage } from '../components/Navbar';

interface DashboardPageProps {
  onSelectUser: (user: FitUser) => void;
  onNavigate: (page: NavPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectUser, onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Live Database Metrics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            FitBuddy Analytics Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Aggregated distribution of fitness goals, biometrics, and active user regimens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('generate')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Plan</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Computing database statistics...</p>
        </div>
      ) : !stats || stats.totalUsers === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">No Statistics Available Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              The database does not have any recorded users yet. Create your first fitness plan or add demo users to populate analytics.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              Generate First Plan
            </button>
            <button
              onClick={() => onNavigate('users')}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              Go to Users Page
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 5 Main Goal Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Users */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
                <Users className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalUsers}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">100%</span>
              </div>
              <p className="text-[11px] text-slate-400">Profiles stored in database</p>
            </div>

            {/* Weight Loss Goals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-rose-500">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Weight Loss</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.weightLossCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stats.totalUsers > 0 ? Math.round((stats.weightLossCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Deficit & cardio plans</p>
            </div>

            {/* Muscle Gain Goals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Muscle Gain</span>
                <Dumbbell className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.muscleGainCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stats.totalUsers > 0 ? Math.round((stats.muscleGainCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Hypertrophy routines</p>
            </div>

            {/* Weight Gain Goals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-amber-500">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Weight Gain</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.weightGainCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stats.totalUsers > 0 ? Math.round((stats.weightGainCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Caloric surplus plans</p>
            </div>

            {/* General Fitness Goals */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-indigo-500">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">General Fitness</span>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.generalFitnessCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stats.totalUsers > 0 ? Math.round((stats.generalFitnessCount / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Longevity & vitality</p>
            </div>
          </div>

          {/* Goal Distribution Breakdown Visual Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-slate-900 text-base">
                Fitness Goal Breakdown
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Weight Loss', count: stats.weightLossCount, color: 'bg-rose-500', barBg: 'bg-rose-100' },
                  { label: 'Muscle Gain', count: stats.muscleGainCount, color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
                  { label: 'Weight Gain', count: stats.weightGainCount, color: 'bg-amber-500', barBg: 'bg-amber-100' },
                  { label: 'General Fitness', count: stats.generalFitnessCount, color: 'bg-indigo-500', barBg: 'bg-indigo-100' },
                ].map((item) => {
                  const percentage = stats.totalUsers > 0 ? Math.round((item.count / stats.totalUsers) * 100) : 0;
                  return (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item.label}</span>
                        <span className="text-slate-500 font-medium">
                          {item.count} users ({percentage}%)
                        </span>
                      </div>
                      <div className={`h-2.5 w-full rounded-full ${item.barBg} overflow-hidden`}>
                        <div
                          className={`h-full rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Average Biometrics Sub-Card */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Average Athlete Age</span>
                  <span className="text-lg font-bold text-slate-800 mt-0.5 block">{stats.averageAge} years</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Average Cohort BMI</span>
                  <span className="text-lg font-bold text-slate-800 mt-0.5 block">{stats.averageBmi}</span>
                </div>
              </div>
            </div>

            {/* Activity Level Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Baseline Activity Levels
                </h3>
                <p className="text-xs text-slate-500">
                  Sedentary vs Active baseline distribution across recorded users.
                </p>

                <div className="space-y-3 mt-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Low Activity</span>
                    <span className="font-bold text-slate-900">{stats.activityBreakdown.low} users</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Moderate Activity</span>
                    <span className="font-bold text-slate-900">{stats.activityBreakdown.moderate} users</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">High Activity</span>
                    <span className="font-bold text-slate-900">{stats.activityBreakdown.high} users</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('users')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Inspect All User Records</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Users Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Recent Users
                </h3>
                <p className="text-xs text-slate-500">
                  Latest profiles and AI fitness plans generated
                </p>
              </div>
              <button
                onClick={() => onNavigate('users')}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</h4>
                        {user.is_demo && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            Demo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {user.age} yrs • {user.gender} • {user.height}cm / {user.weight}kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {user.goal}
                    </span>
                    <button
                      onClick={() => onSelectUser(user)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Plan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
