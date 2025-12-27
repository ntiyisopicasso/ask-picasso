import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { MoodIndicator } from '@/components/MoodIndicator';
import { SettingsPanel } from '@/components/SettingsPanel';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import avatarIcon from '@/assets/avatar-icon.png';

const suggestedPrompts = [
  "I'm feeling overwhelmed today",
  "Something great happened!",
  "I need someone to talk to",
  "How can I manage stress?",
];

const PicassoChat = () => {
  const { messages, sendMessage, isLoading, currentMood, clearChat, deleteMessage } = useChat();
  const { settings, updateSetting } = useSettings();
  const [input, setInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleNewChat = () => {
    clearChat();
    textareaRef.current?.focus();
  };

  const speechSettings = {
    rate: settings.voiceRate,
    pitch: settings.voicePitch,
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={avatarIcon} alt="Picasso" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-base sm:text-lg font-display font-medium text-foreground tracking-tight">Ask Picasso</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">AI Companion</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {messages.length > 0 && (
            <MoodIndicator mood={currentMood} size="sm" />
          )}
          {/* Desktop only settings and clear buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <SettingsPanel 
              settings={settings} 
              onSettingChange={updateSetting}
            />
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearChat}
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Settings Panel (controlled) */}
      <SettingsPanel 
        settings={settings} 
        onSettingChange={updateSetting}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        showTrigger={false}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-6">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-8 sm:py-16 px-2"
              >
                <img src={avatarIcon} alt="Picasso" className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-glow object-cover mb-4 sm:mb-6" />
                
                <h2 className="text-xl sm:text-2xl font-display text-foreground mb-2">
                  Ask Picasso
                </h2>
                <p className="text-muted-foreground text-center text-xs sm:text-sm max-w-md mb-6 sm:mb-10 leading-relaxed px-2">
                  Share what's on your mind. I'm here to listen and support you with empathy and understanding.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-2 sm:px-0">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={prompt}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-card border border-border text-xs sm:text-sm text-foreground hover:bg-accent hover:border-primary/20 transition-all duration-200 text-left"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  index={index} 
                  speechSettings={speechSettings}
                  onDelete={deleteMessage}
                />
              ))
            )}
          </AnimatePresence>

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Swipe hint for mobile - shown only when there are messages */}
      {messages.length > 0 && (
        <div className="sm:hidden text-center text-[10px] text-muted-foreground py-1 bg-background border-t border-border">
          Swipe left on a message to delete
        </div>
      )}

      {/* Input Area */}
      <div className="px-3 sm:px-4 pb-20 sm:pb-6 pt-2 bg-background">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="flex items-end gap-2 p-1.5 sm:p-2 rounded-xl bg-card border border-border shadow-soft focus-within:border-primary/50 focus-within:shadow-glow transition-all duration-200">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[40px] sm:min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground text-sm"
              disabled={isLoading}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg gradient-warm text-primary-foreground transition-all duration-200 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="hidden sm:block text-center text-xs text-muted-foreground mt-3">
            Picasso provides support but is not a replacement for professional help
          </p>
        </form>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onNewChat={handleNewChat}
        onClearChat={clearChat}
        onOpenSettings={() => setSettingsOpen(true)}
        hasMessages={messages.length > 0}
      />
    </div>
  );
};

export default PicassoChat;
