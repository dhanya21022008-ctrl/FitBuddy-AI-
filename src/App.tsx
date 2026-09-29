import React, { useState, useEffect } from 'react';
import { Navbar, NavPage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { GeneratePlanPage } from './pages/GeneratePlanPage';
import { PlanResultPage } from './pages/PlanResultPage';
import { UsersPage } from './pages/UsersPage';
import { UserDetailsPage } from './pages/UserDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { FitUser } from './types/fitness';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [currentUser, setCurrentUser] = useState<FitUser | null>(null);
  const [engineUsed, setEngineUsed] = useState<string | undefined>(undefined);
  const [usersCount, setUsersCount] = useState<number>(0);

  // Fetch count of users for navbar badge
  const refreshUsersCount = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const users = await res.json();
        setUsersCount(users.length);
      }
    } catch (e) {
      // Ignore network errors
    }
  };

  useEffect(() => {
    refreshUsersCount();
  }, [currentPage]);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanGenerated = (user: FitUser, engine?: string) => {
    setCurrentUser(user);
    setEngineUsed(engine);
    setCurrentPage('result');
    refreshUsersCount();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUser = (user: FitUser) => {
    setCurrentUser(user);
    setCurrentPage('user-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserDeleted = (deletedUserId: string) => {
    setCurrentUser(null);
    setCurrentPage('users');
    refreshUsersCount();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        usersCount={usersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            totalUsersCount={usersCount}
          />
        )}

        {currentPage === 'generate' && (
          <GeneratePlanPage onPlanGenerated={handlePlanGenerated} />
        )}

        {currentPage === 'result' && currentUser && (
          <PlanResultPage
            user={currentUser}
            engineUsed={engineUsed}
            onGenerateAnother={() => handleNavigate('generate')}
            onViewUsers={() => handleNavigate('users')}
          />
        )}

        {currentPage === 'users' && (
          <UsersPage
            onSelectUser={handleSelectUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'user-details' && currentUser && (
          <UserDetailsPage
            user={currentUser}
            onBackToUsers={() => handleNavigate('users')}
            onUserDeleted={handleUserDeleted}
            onGenerateAnother={() => handleNavigate('generate')}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onSelectUser={handleSelectUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
