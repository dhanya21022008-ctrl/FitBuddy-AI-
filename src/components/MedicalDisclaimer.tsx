import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 p-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Educational & General Fitness Only:</strong> This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting a new exercise or nutrition program.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
            <span>Important Health & Medical Disclaimer</span>
            <span className="text-[11px] font-medium bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
              Notice
            </span>
          </h4>
          <p className="text-xs text-amber-900/90 mt-1.5 leading-relaxed">
            This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. FitBuddy-AI does not diagnose, treat, cure, or prevent any medical condition. Consult a qualified healthcare professional or physician before starting a new exercise or nutrition program, especially if you have a medical condition, injuries, or dietary restrictions.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>FitBuddy-AI promotes safe, progressive, and sustainable lifestyle practices.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
