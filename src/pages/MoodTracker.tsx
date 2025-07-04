import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useData } from '../contexts/DataContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MoodTracker: React.FC = () => {
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const { moodEntries, saveMoodEntry } = useData();

  const moods = [
    { value: 5, emoji: '😄', label: 'Excellent', color: 'text-green-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-blue-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 2, emoji: '😞', label: 'Bad', color: 'text-orange-500' },
    { value: 1, emoji: '😭', label: 'Terrible', color: 'text-red-500' }
  ];

  const handleSaveMood = async () => {
    if (selectedMood === null) return;
    
    await saveMoodEntry(selectedMood, moodNote);
    setShowMoodInput(false);
    setSelectedMood(null);
    setMoodNote('');
  };

  // Generate chart data
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const chartData = {
    labels: last30Days.map(date => format(date, 'MMM dd')),
    datasets: [
      {
        label: 'Mood',
        data: last30Days.map(date => {
          const entry = moodEntries.find(entry => 
            format(entry.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          return entry ? entry.mood : null;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Your Mood Over Time',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const moodLabels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
            return moodLabels[value];
          }
        }
      },
      x: {
        display: true
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mood Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your emotional well-being</p>
          </div>
          <button
            onClick={() => setShowMoodInput(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Mood</span>
          </button>
        </div>

        {/* Mood Input Modal */}
        {showMoodInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">How are you feeling?</h2>
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedMood === mood.value
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className={`text-xs font-medium ${mood.color}`}>{mood.label}</div>
                  </button>
                ))}
              </div>

              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="What's contributing to this mood? (optional)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={3}
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowMoodInput(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMood}
                  disabled={selectedMood === null}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Mood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Entries
          </h2>
          
          {moodEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mood entries yet. Start tracking your mood today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moodEntries.slice(0, 5).map((entry) => {
                const mood = moods.find(m => m.value === entry.mood);
                return (
                  <div key={entry.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl">{mood?.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${mood?.color}`}>{mood?.label}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(entry.timestamp, 'MMM dd, yyyy')}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;