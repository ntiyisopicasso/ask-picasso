import { motion } from 'framer-motion';
import type { MoodData } from '@/types/chat';

interface MoodIndicatorProps {
  mood: MoodData;
  size?: 'sm' | 'md' | 'lg';
}

const moodConfig: Record<string, { label: string; className: string }> = {
  happy: { label: 'Happy', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  sad: { label: 'Sad', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  anxious: { label: 'Anxious', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  calm: { label: 'Calm', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  angry: { label: 'Frustrated', className: 'bg-red-100 text-red-700 border-red-200' },
  neutral: { label: 'Neutral', className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export const MoodIndicator = ({ mood, size = 'md' }: MoodIndicatorProps) => {
  const config = moodConfig[mood.mood] || moodConfig.neutral;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}
    >
      <span>{mood.emoji}</span>
      {size !== 'sm' && <span>{config.label}</span>}
    </motion.div>
  );
};
