export type Mood = 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'neutral';

export interface MoodData {
  mood: Mood;
  confidence: number;
  emoji: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mood?: MoodData;
  timestamp: Date;
}
