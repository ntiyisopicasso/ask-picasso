import { motion } from 'framer-motion';
import avatarIcon from '@/assets/avatar-icon.png';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 justify-start"
    >
      <img src={avatarIcon} alt="Picasso" className="flex-shrink-0 w-8 h-8 rounded-lg object-cover" />

      <div className="px-4 py-3 rounded-2xl rounded-bl-lg bg-card border border-border">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
        </div>
      </div>
    </motion.div>
  );
};
