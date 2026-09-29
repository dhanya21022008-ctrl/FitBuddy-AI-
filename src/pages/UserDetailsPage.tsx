import React, { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, Sparkles } from 'lucide-react';
import { FitUser } from '../types/fitness';
import { PlanDisplay } from '../components/PlanDisplay';

interface UserDetailsPageProps {
  user: FitUser;
  onBackToUsers: () => void;
  onUserDeleted: (userId: string) => void;
  onGenerateAnother: () => void;
}

export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({
  user,
  onBackToUsers,
  onUserDeleted,
  onGenerateAnother,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        onUserDeleted(user.id);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBackToUsers}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete User</span>
          </button>
        </div>
      </div>

      {/* Reusable Plan Display */}
      <PlanDisplay
        user={user}
        onGenerateAnother={onGenerateAnother}
        onViewUsers={onBackToUsers}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">Delete {user.name}'s Profile?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This action is permanent and will delete all stored workout and nutrition data for this user.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
