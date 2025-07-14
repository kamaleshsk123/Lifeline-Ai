import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { isSameDay, differenceInDays } from 'date-fns';

interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  timestamp: Date;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  timestamp: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timestamp: Date;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

interface DataContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  goals: Goal[];
  badges: Badge[];
  saveMoodEntry: (mood: number, note: string) => Promise<void>;
  saveJournalEntry: (
    title: string,
    content: string,
    sentiment: "positive" | "neutral" | "negative"
  ) => Promise<void>;
  saveGoal: (title: string, description: string) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  loading: boolean;
  crisisModalOpen: boolean;
  setCrisisModalOpen: (open: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const unlockBadge = async (badgeName: string, description: string) => {
    if (!user || badges.some(b => b.name === badgeName)) return; // Don't unlock if already unlocked

    const newBadge: Omit<Badge, "id"> = {
      name: badgeName,
      description,
      unlockedAt: new Date(),
    };

    try {
      const docRef = doc(collection(db, "badges"));
      await setDoc(docRef, {
        ...newBadge,
        userId: user.uid,
        unlockedAt: newBadge.unlockedAt,
      });

      setBadges((prev) => [
        {
          ...newBadge,
          id: docRef.id,
        },
        ...prev,
      ]);
      // Optionally, show a toast notification for the unlocked badge
      console.log(`Badge Unlocked: ${badgeName}`);
    } catch (error) {
      console.error("Error unlocking badge:", error);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load mood entries
      const moodQuery = query(
        collection(db, "moods"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const moodSnapshot = await getDocs(moodQuery);
      const moods = moodSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as MoodEntry[];
      setMoodEntries(moods);

      // Load journal entries
      const journalQuery = query(
        collection(db, "journals"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const journalSnapshot = await getDocs(journalQuery);
      const journals = journalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as JournalEntry[];
      setJournalEntries(journals);

      // Load goals
      const goalsQuery = query(
        collection(db, "goals"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      const goals = goalsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Goal[];
      setGoals(goals);

      // Load badges
      const badgesQuery = query(
        collection(db, "badges"),
        where("userId", "==", user.uid),
        orderBy("unlockedAt", "desc")
      );
      const badgesSnapshot = await getDocs(badgesQuery);
      const userBadges = badgesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        unlockedAt: doc.data().unlockedAt.toDate(),
      })) as Badge[];
      setBadges(userBadges);

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async (mood: number, note: string) => {
    if (!user) return;

    const entry: Omit<MoodEntry, "id"> = {
      mood,
      note,
      timestamp: new Date(),
    };

    try {
      const docRef = doc(collection(db, "moods"));
      await setDoc(docRef, {
        ...entry,
        userId: user.uid,
        timestamp: entry.timestamp,
      });

      setMoodEntries((prev) => {
        const updatedMoods = [
          {
            ...entry,
            id: docRef.id,
          },
          ...prev,
        ];
        // Check for badges
        if (updatedMoods.length === 1) {
          unlockBadge("First Mood Logged", "Logged your first mood entry.");
        }
        // Check for 7-day streak
        const sortedMoods = updatedMoods.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        let streak = 0;
        if (sortedMoods.length > 0) {
          streak = 1;
          for (let i = 0; i < sortedMoods.length - 1; i++) {
            const diff = differenceInDays(sortedMoods[i].timestamp, sortedMoods[i + 1].timestamp);
            if (diff === 1) {
              streak++;
            } else if (diff > 1) {
              break;
            }
          }
        }
        if (streak >= 7) {
          unlockBadge("7-Day Mood Streak", "Logged your mood for 7 consecutive days.");
        }
        return updatedMoods;
      });
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
  };

  const saveJournalEntry = async (
    title: string,
    content: string,
    sentiment: "positive" | "neutral" | "negative"
  ) => {
    if (!user) return;

    const entry: Omit<JournalEntry, "id"> = {
      title,
      content,
      sentiment,
      timestamp: new Date(),
    };

    try {
      const docRef = doc(collection(db, "journals"));
      await setDoc(docRef, {
        ...entry,
        userId: user.uid,
        timestamp: entry.timestamp,
      });

      setJournalEntries((prev) => {
        const updatedJournals = [
          {
            ...entry,
            id: docRef.id,
          },
          ...prev,
        ];
        if (updatedJournals.length === 1) {
          unlockBadge("First Journal Entry", "Wrote your first journal entry.");
        }
        if (updatedJournals.length >= 5) {
          unlockBadge("Journal Enthusiast", "Wrote 5 or more journal entries.");
        }
        return updatedJournals;
      });
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const saveGoal = async (title: string, description: string) => {
    if (!user) return;

    const entry: Omit<Goal, "id"> = {
      title,
      description,
      completed: false,
      timestamp: new Date(),
    };

    try {
      const docRef = doc(collection(db, "goals"));
      await setDoc(docRef, {
        ...entry,
        userId: user.uid,
        timestamp: entry.timestamp,
      });

      setGoals((prev) => [
        {
          ...entry,
          id: docRef.id,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  const updateGoal = async (goal: Goal) => {
    if (!user) return;

    try {
      const docRef = doc(db, "goals", goal.id);
      await updateDoc(docRef, { ...goal });

      setGoals((prev) => {
        const updatedGoals = prev.map((g) => (g.id === goal.id ? goal : g));
        if (goal.completed && !prev.find(g => g.id === goal.id)?.completed) {
          unlockBadge("First Goal Achieved", "Completed your first goal.");
        }
        return updatedGoals;
      });
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      const docRef = doc(db, "goals", id);
      await deleteDoc(docRef);

      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const value = {
    moodEntries,
    journalEntries,
    goals,
    badges,
    saveMoodEntry,
    saveJournalEntry,
    saveGoal,
    updateGoal,
    deleteGoal,
    loading,
    crisisModalOpen,
    setCrisisModalOpen,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
