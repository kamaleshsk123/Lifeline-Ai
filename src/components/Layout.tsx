import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, BarChart3, BookOpen, Settings, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setCrisisModalOpen } = useData();

  const navItems = [
    { path: '/app', icon: MessageCircle, label: 'Chat' },
    { path: '/mood', icon: BarChart3, label: 'Mood' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Header for mobile */}
      <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-pink-500" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">LifeLine.AI</span>
        </div>
        <button
          onClick={() => setCrisisModalOpen(true)}
          className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 hover:bg-red-600 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Crisis</span>
        </button>
      </header>

      {/* Sidebar for desktop */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="h-10 w-10 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">LifeLine.AI</span>
          </div>
          
          <button
            onClick={() => setCrisisModalOpen(true)}
            className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors mb-6"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Crisis Support</span>
          </button>

          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;