
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subDays, format, isSameDay } from 'date-fns';
import { Lightbulb } from 'lucide-react';

const Insights: React.FC = () => {
  const { moodEntries, journalEntries } = useData();

  const getAverageMood = (entries: any[]) => {
    if (entries.length === 0) return null;
    const totalMood = entries.reduce((acc, entry) => acc + entry.mood, 0);
    return (totalMood / entries.length).toFixed(1);
  };

  const getMoodTrend = () => {
    const today = new Date();
    const last7DaysMoods = moodEntries.filter(entry =>
      entry.timestamp >= subDays(today, 7)
    );
    const last30DaysMoods = moodEntries.filter(entry =>
      entry.timestamp >= subDays(today, 30)
    );

    const avgLast7Days = getAverageMood(last7DaysMoods);
    const avgLast30Days = getAverageMood(last30DaysMoods);

    let trend = "";
    if (avgLast7Days && avgLast30Days) {
      if (parseFloat(avgLast7Days) > parseFloat(avgLast30Days)) {
        trend = "Your mood has been improving over the last 7 days.";
      } else if (parseFloat(avgLast7Days) < parseFloat(avgLast30Days)) {
        trend = "Your mood has slightly declined over the last 7 days.";
      } else {
        trend = "Your mood has been stable over the last 7 days.";
      }
    }
    return { avgLast7Days, avgLast30Days, trend };
  };

  const getSentimentDistribution = () => {
    if (journalEntries.length === 0) return null;
    const distribution = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    journalEntries.forEach((entry) => {
      distribution[entry.sentiment]++;
    });
    return distribution;
  };

  const getKeywordAnalysis = () => {
    const positiveWords = ['happy', 'joy', 'excited', 'grateful', 'love', 'amazing', 'wonderful', 'great', 'fantastic', 'blessed'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'depressed', 'anxious', 'worried', 'scared'];

    const allJournalContent = journalEntries.map(entry => entry.content.toLowerCase()).join(" ");
    const words = allJournalContent.split(/\s+/);

    const positiveKeywords = positiveWords.filter(word => words.includes(word));
    const negativeKeywords = negativeWords.filter(word => words.includes(word));

    return { positiveKeywords, negativeKeywords };
  };

  const getRecommendations = () => {
    const { avgLast7Days } = getMoodTrend();
    const sentimentDist = getSentimentDistribution();
    let recommendations: string[] = [];

    if (avgLast7Days && parseFloat(avgLast7Days) < 3) {
      recommendations.push("Consider engaging in activities that usually boost your mood.");
    }

    if (sentimentDist && sentimentDist.negative > sentimentDist.positive) {
      recommendations.push("Try focusing on positive aspects and practicing gratitude in your journal.");
    }

    if (moodEntries.length === 0 && journalEntries.length === 0) {
      recommendations.push("Start tracking your mood and writing journal entries to get personalized insights!");
    }

    return recommendations;
  };

  const { avgLast7Days, trend } = getMoodTrend();
  const sentimentDistribution = getSentimentDistribution();
  const { positiveKeywords, negativeKeywords } = getKeywordAnalysis();
  const recommendations = getRecommendations();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Personalized Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Average Mood (Last 7 Days)</h3>
            <p>{avgLast7Days || 'No data yet'}</p>
            {trend && <p className="text-sm text-gray-600 dark:text-gray-400">{trend}</p>}
          </div>
          <div>
            <h3 className="font-bold">Journal Sentiment Distribution</h3>
            {sentimentDistribution ? (
              <ul>
                <li>Positive: {sentimentDistribution.positive}</li>
                <li>Neutral: {sentimentDistribution.neutral}</li>
                <li>Negative: {sentimentDistribution.negative}</li>
              </ul>
            ) : (
              <p>No data yet</p>
            )}
          </div>
          <div>
            <h3 className="font-bold">Common Keywords</h3>
            {positiveKeywords.length > 0 && (
              <p>Positive: {positiveKeywords.join(", ")}</p>
            )}
            {negativeKeywords.length > 0 && (
              <p>Negative: {negativeKeywords.join(", ")}</p>
            )}
            {positiveKeywords.length === 0 && negativeKeywords.length === 0 && (
              <p>No significant keywords yet.</p>
            )}
          </div>
          <div>
            <h3 className="font-bold">Recommendations</h3>
            {recommendations.length > 0 ? (
              <ul className="list-disc list-inside">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p>Keep tracking your mood and journaling for more insights!</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Insights;
