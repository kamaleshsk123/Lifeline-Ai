
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Goals: React.FC = () => {
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const { goals, saveGoal, deleteGoal, updateGoal } = useData();

  const handleSaveGoal = async () => {
    if (!title.trim()) return;

    if (editingGoal) {
      await updateGoal({ ...editingGoal, title, description });
    } else {
      await saveGoal(title, description);
    }

    setShowGoalInput(false);
    setTitle('');
    setDescription('');
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description);
    setShowGoalInput(true);
  };

  const handleToggleComplete = async (goal: any) => {
    await updateGoal({ ...goal, completed: !goal.completed });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Goals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Set and track your personal goals</p>
          </div>
          <button
            onClick={() => {
              setShowGoalInput(true);
              setEditingGoal(null);
              setTitle('');
              setDescription('');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Goal Input Modal */}
        {showGoalInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {editingGoal ? 'Edit Goal' : 'New Goal'}
              </h2>
              
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Goal description (optional)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={4}
              />

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowGoalInput(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  disabled={!title.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingGoal ? 'Save Changes' : 'Save Goal'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No goals yet.</p>
              <p>Click "New Goal" to get started!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-start space-x-4 ${
                  goal.completed ? 'opacity-60' : ''
                }`}
              >
                <button onClick={() => handleToggleComplete(goal)} className="mt-1">
                  {goal.completed ? (
                    <CheckSquare className="h-6 w-6 text-green-500" />
                  ) : (
                    <Square className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold text-gray-800 dark:text-white ${
                    goal.completed ? 'line-through' : ''
                  }`}>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {goal.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
