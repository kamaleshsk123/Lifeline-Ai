import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import Goals from './pages/Goals';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CrisisModal from './components/CrisisModal';
import Onboarding from './components/Onboarding';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Layout>
                      <Chat />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/mood" element={
                  <ProtectedRoute>
                    <Layout>
                      <MoodTracker />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/journal" element={
                  <ProtectedRoute>
                    <Layout>
                      <Journal />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <Layout>
                      <Goals />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
              <CrisisModal />
              <Onboarding isOpen={showOnboarding} onClose={handleOnboardingClose} />
            </div>
          </Router>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;