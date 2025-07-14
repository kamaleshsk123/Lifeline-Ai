import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-center"
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Welcome to LifeLine.AI!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Your supportive AI companion for mental well-being.
            </p>
            
            <div className="space-y-4 text-left mb-8">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl">
                <h3 className="font-bold text-blue-800 dark:text-blue-200">AI Chat</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Talk to LifeLine AI about anything on your mind.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-xl">
                <h3 className="font-bold text-green-800 dark:text-green-200">Mood Tracker</h3>
                <p className="text-sm text-green-700 dark:text-green-300">Monitor your emotional well-being over time.</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Personal Journal</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Express your thoughts and feelings privately.</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl">
                <h3 className="font-bold text-purple-800 dark:text-purple-200">Goals</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">Set and track your personal development goals.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Onboarding;
