import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FitUser } from '../types/fitness';
import { PlanDisplay } from '../components/PlanDisplay';

interface PlanResultPageProps {
  user: FitUser;
  engineUsed?: string;
  onGenerateAnother: () => void;
  onViewUsers: () => void;
}

export const PlanResultPage: React.FC<PlanResultPageProps> = ({
  user,
  engineUsed,
  onGenerateAnother,
  onViewUsers,
}) => {
  useEffect(() => {
    // Joyful celebration confetti
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#0d9488', '#0284c7'],
      });
    } catch (e) {
      // Ignore in headless/test environments
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <PlanDisplay
        user={user}
        engineUsed={engineUsed}
        onGenerateAnother={onGenerateAnother}
        onViewUsers={onViewUsers}
      />
    </div>
  );
};
