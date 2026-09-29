import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trash2,
  Eye,
  PlusCircle,
  Sparkles,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { FitUser, FitnessGoal } from '../types/fitness';
import { calculateBMI } from '../utils/bmi';
import { NavPage } from '../components/Navbar';

interface UsersPageProps {
  onSelectUser: (user: FitUser) => void;
  onNavigate: (page: NavPage) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ onSelectUser, onNavigate }) => {
  const [users, setUsers] = useState<FitUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState<string>('All');
  const [userToDelete, setUserToDelete] = useState<FitUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSeedDemo = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/seed-demo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setStatusMessage('Demo users populated successfully! Clearly marked with "Demo" tags.');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to seed demo users:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setStatusMessage(`User "${userToDelete.name}" successfully deleted.`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.goal.toLowerCase().includes(q) ||
      u.gender.toLowerCase().includes(q) ||
      u.activity.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);

    const matchesGoal = goalFilter === 'All' || u.goal === goalFilter;

    return matchesSearch && matchesGoal;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Database Registry
            </span>
            <span className="text-xs text-slate-500">
              {users.length} registered {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            FitBuddy Users
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Browse stored user records, manage profiles, and inspect generated AI fitness plans.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Populate test users for review"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isSeeding ? 'Seeding...' : 'Add Demo Users'}</span>
          </button>

          <button
            onClick={() => onNavigate('generate')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, goal, gender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Goal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 pl-1">
            <Filter className="w-3 h-3" /> Goal:
          </span>
          {['All', 'Weight Loss', 'Muscle Gain', 'Weight Gain', 'General Fitness'].map((goal) => {
            const isSelected = goalFilter === goal;
            return (
              <button
                key={goal}
                onClick={() => setGoalFilter(goal)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Content */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading stored users from database...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">No users found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              {searchQuery || goalFilter !== 'All'
                ? 'Try adjusting your search criteria or clear active filters.'
                : 'There are currently no users in the database. Generate your first personalized fitness plan or populate demo data.'}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
            >
              Generate First Plan
            </button>
            <button
              onClick={handleSeedDemo}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              Populate Demo Users
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-3">Age / Gender</th>
                  <th className="py-3.5 px-3">Height & Weight</th>
                  <th className="py-3.5 px-3">Goal</th>
                  <th className="py-3.5 px-3">Activity</th>
                  <th className="py-3.5 px-3">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const bmi = calculateBMI(user.height, user.weight);
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{user.name}</span>
                              {user.is_demo && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                  Demo
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-3 text-slate-700">
                        {user.age} yrs • {user.gender}
                      </td>

                      {/* Height / Weight / BMI */}
                      <td className="py-3.5 px-3">
                        <span className="text-slate-800 font-medium">
                          {user.height} cm • {user.weight} kg
                        </span>
                        {bmi && (
                          <span className="text-[10px] text-slate-400 block">
                            BMI: {bmi.bmi} ({bmi.category})
                          </span>
                        )}
                      </td>

                      {/* Goal */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {user.goal}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-3 text-slate-700">
                        {user.activity}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectUser(user)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="View AI Fitness Plan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Responsive Cards View */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map((user) => {
              const bmi = calculateBMI(user.height, user.weight);
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {user.id}
                          </span>
                        </div>
                      </div>
                      {user.is_demo && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          Demo
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Biometrics</span>
                        <span className="font-semibold text-slate-800">
                          {user.age}y • {user.gender}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block">Height / Weight</span>
                        <span className="font-semibold text-slate-800">
                          {user.height}cm • {user.weight}kg
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[11px] border border-emerald-200/60">
                        {user.goal}
                      </span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {user.activity} Activity
                      </span>
                      {bmi && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          BMI: {bmi.bmi}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectUser(user)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Plan</span>
                      </button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">Delete User Profile?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">{userToDelete.name}</strong> ({userToDelete.goal})?
                This will permanently remove their profile and generated AI plan from the database.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
