import React from 'react';
import { Dumbbell, Heart, Sparkles, Database, Code, ShieldCheck } from 'lucide-react';
import { NavPage } from './Navbar';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                FitBuddy<span className="text-emerald-400">-AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              AI-Powered Personalized Fitness Plan Generator. Designed for holistic health, structured strength and conditioning routines, and science-grounded nutrition advice.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Gemini AI
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Database className="w-3 h-3 text-cyan-400" />
                Supabase / PostgreSQL Ready
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Code className="w-3 h-3 text-indigo-400" />
                React 19 + TypeScript
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('generate')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
                >
                  Generate Plan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
                >
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('users')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
                >
                  Registered Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 cursor-pointer"
                >
                  About & Tech Specs
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Context */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Academic Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developed as a real-world BSc Computer Science Capstone Project demonstrating Full-Stack Web Architecture, LLM Prompt Engineering, and Database Integration.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero client-exposed API keys</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FitBuddy-AI. General fitness & educational guidance.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for healthy lifestyles
          </p>
        </div>
      </div>
    </footer>
  );
};
