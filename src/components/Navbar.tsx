import React, { useState } from 'react';
import { Dumbbell, Menu, X, Sparkles, PlusCircle, Users, BarChart3, Info, Home } from 'lucide-react';

export type NavPage = 'home' | 'generate' | 'dashboard' | 'users' | 'about' | 'result' | 'user-details';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  usersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, usersCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavPage, label: 'Home', icon: Home },
    { id: 'generate' as NavPage, label: 'Generate Plan', icon: Sparkles, highlight: true },
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: BarChart3 },
    { id: 'users' as NavPage, label: 'Users', icon: Users, badge: usersCount },
    { id: 'about' as NavPage, label: 'About', icon: Info },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  FitBuddy<span className="text-emerald-600">-AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium -mt-0.5">
                Smart Fitness Companion
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === 'users' && currentPage === 'user-details') ||
                (item.id === 'generate' && currentPage === 'result');

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-emerald-700/25 ring-2 ring-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md hover:shadow-emerald-600/20'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CTA on Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('generate')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>New Plan</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('generate')}
              className="p-2 rounded-xl bg-emerald-600 text-white cursor-pointer"
              title="Generate Plan"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'users' && currentPage === 'user-details') ||
              (item.id === 'generate' && currentPage === 'result');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
