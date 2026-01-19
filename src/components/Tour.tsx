import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '../contexts/ThemeContext';

interface TourProps {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
}

const Tour: React.FC<TourProps> = ({ runTour, setRunTour }) => {
  const { isDark } = useTheme();
  const [steps, setSteps] = useState<Step[]>([
    {
      target: '.chat-nav-item-desktop', 
      content: 'This is your AI chat companion. Ask anything!',
      disableBeacon: true,
    },
    {
      target: '.mood-nav-item-desktop',
      content: 'Track your daily mood and see trends here.',
    },
    {
      target: '.journal-nav-item-desktop',
      content: 'Write down your thoughts and feelings in your private journal.',
    },
    {
      target: '.goals-nav-item-desktop',
      content: 'Set and achieve your personal goals.',
    },
    {
      target: '.crisis-button', // This is shared/handled separately or needs similar treatment if duplicated
      content: 'In times of need, access immediate crisis support.',
    },
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasCompletedTour', 'true');
    }
  };

  return (
    <Joyride
      run={runTour}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: isDark ? '#6366F1' : '#3B82F6', // Indigo-500 for dark, Blue-500 for light
          textColor: isDark ? '#E5E7EB' : '#1F2937', // Gray-200 for dark, Gray-800 for light
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF', // Gray-800 for dark, White for light
        },
        buttonNext: {
          backgroundColor: isDark ? '#6366F1' : '#3B82F6',
          color: '#FFFFFF',
        },
        buttonBack: {
          color: isDark ? '#E5E7EB' : '#1F2937',
        },
        buttonSkip: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          color: isDark ? '#E5E7EB' : '#1F2937',
          borderRadius: '0.75rem', // rounded-xl
          padding: '1.5rem',
        },
        tooltipTitle: {
          color: isDark ? '#E5E7EB' : '#1F2937',
          fontWeight: 'bold',
        },
        tooltipContent: {
          color: isDark ? '#D1D5DB' : '#4B5563',
        },
        spotlight: {
          borderRadius: '0.75rem',
        },
      }}
    />
  );
};

export default Tour;
