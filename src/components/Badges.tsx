import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { format } from 'date-fns';

const Badges: React.FC = () => {
  const { badges } = useData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2" /> Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Keep using the app to unlock your first badge!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
                <Award className="h-12 w-12 text-yellow-500 mb-2" />
                <h4 className="font-bold text-gray-800 dark:text-white">{badge.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Unlocked: {format(badge.unlockedAt, 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Badges;
