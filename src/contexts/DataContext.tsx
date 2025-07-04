import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

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

interface DataContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  saveMoodEntry: (mood: number, note: string) => Promise<void>;
  saveJournalEntry: (
    title: string,
    content: string,
    sentiment: "positive" | "neutral" | "negative"
  ) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

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

      setMoodEntries((prev) => [
        {
          ...entry,
          id: docRef.id,
        },
        ...prev,
      ]);
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

      setJournalEntries((prev) => [
        {
          ...entry,
          id: docRef.id,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const value = {
    moodEntries,
    journalEntries,
    saveMoodEntry,
    saveJournalEntry,
    loading,
    crisisModalOpen,
    setCrisisModalOpen,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
