import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Volume2, VolumeX, User, Trash2 } from 'lucide-react';
import type { Message } from '@/types/chat';
import { MoodIndicator } from './MoodIndicator';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import avatarIcon from '@/assets/avatar-icon.png';

interface ChatMessageProps {
  message: Message;
  index: number;
  speechSettings?: { rate: number; pitch: number };
  onDelete?: (id: string) => void;
}

export const ChatMessage = ({ message, index, speechSettings, onDelete }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const { speak, stop, isSpeaking } = useSpeech(speechSettings);
  const [isDeleting, setIsDeleting] = useState(false);

  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0],
    ['hsl(var(--destructive))', 'transparent']
  );
  const deleteOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const handleListen = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100 && onDelete) {
      setIsDeleting(true);
      setTimeout(() => onDelete(message.id), 200);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete indicator background */}
      <motion.div 
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 rounded-xl"
        style={{ background, opacity: deleteOpacity }}
      >
        <Trash2 className="w-5 h-5 text-destructive-foreground" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isDeleting ? 0 : 1, 
          y: 0,
          x: isDeleting ? -300 : 0
        }}
        transition={{ delay: isDeleting ? 0 : index * 0.03, duration: 0.2 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.3, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`flex gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'} touch-pan-y cursor-grab active:cursor-grabbing`}
      >
        {!isUser && (
          <img src={avatarIcon} alt="Picasso" className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" />
        )}

        <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm leading-relaxed ${
              isUser 
                ? 'gradient-message-user text-primary-foreground rounded-br-lg' 
                : 'bg-card text-foreground rounded-bl-lg border border-border'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          <div className="flex items-center gap-2 px-1">
            {isUser && message.mood && (
              <MoodIndicator mood={message.mood} size="sm" />
            )}

            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleListen}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </Button>
            )}

            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-secondary flex items-center justify-center">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-foreground" />
          </div>
        )}
      </motion.div>
    </div>
  );
};
