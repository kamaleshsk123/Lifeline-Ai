import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare, Heart, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CrisisModal: React.FC = () => {
  const { crisisModalOpen, setCrisisModalOpen } = useData();

  const helplines = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support in the US',
      country: 'US'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: '24/7 text-based crisis support',
      country: 'US'
    },
    {
      name: 'AASRA (India)',
      number: '91-9820466726',
      description: '24/7 crisis support in India',
      country: 'India'
    },
    {
      name: 'Samaritans (UK)',
      number: '116 123',
      description: '24/7 crisis support in the UK',
      country: 'UK'
    }
  ];

  const BreathingExercise = () => {
    const [phase, setPhase] = React.useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [count, setCount] = React.useState(4);
    const [isRunning, setIsRunning] = React.useState(false);

    React.useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (isRunning) {
        interval = setInterval(() => {
          setCount(prev => {
            if (prev <= 1) {
              if (phase === 'inhale') {
                setPhase('hold');
                return 4;
              } else if (phase === 'hold') {
                setPhase('exhale');
                return 4;
              } else {
                setPhase('inhale');
                return 4;
              }
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [isRunning, phase]);

    return (
      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900 rounded-2xl">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
          Breathing Exercise
        </h3>
        
        <div className="mb-6">
          <motion.div
            className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{
              scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 1,
            }}
            transition={{ duration: 1 }}
          >
            <Heart className="h-12 w-12 text-white" />
          </motion.div>
          
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
          </div>
          
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-300">
            {count}
          </div>
        </div>
        
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            isRunning
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Stop' : 'Start Exercise'}
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {crisisModalOpen && (
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
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                Crisis Support
              </h2>
              <button
                onClick={() => setCrisisModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Emergency Notice */}
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-4">
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
                  If you're in immediate danger
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Call emergency services immediately: 911 (US), 999 (UK), 100 (India)
                </p>
              </div>

              {/* Crisis Helplines */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Crisis Helplines
                </h3>
                <div className="space-y-3">
                  {helplines.map((helpline, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {helpline.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {helpline.description}
                        </p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                          {helpline.number}
                        </p>
                      </div>
                      <a
                        href={`tel:${helpline.number.replace(/\D/g, '')}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Someone */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message Someone You Trust
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Reach out to a friend, family member, or someone you trust. You don't have to go through this alone.
                  </p>
                  <div className="flex space-x-3">
                    <a
                      href="sms:"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Send Text</span>
                    </a>
                    <a
                      href="mailto:"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Breathing Exercise */}
              <BreathingExercise />

              {/* Additional Resources */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                  Remember
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• You are not alone in this</li>
                  <li>• Your feelings are valid</li>
                  <li>• This moment will pass</li>
                  <li>• You have survived difficult times before</li>
                  <li>• Help is available and you deserve support</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrisisModal;