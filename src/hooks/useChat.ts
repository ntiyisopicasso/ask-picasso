import { useState, useCallback, useEffect } from 'react';
import type { Message, MoodData } from '@/types/chat';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MOOD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-mood`;
const STORAGE_KEY = 'picasso-chat-history';

interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mood?: MoodData;
  timestamp: string;
}

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: StoredMessage[] = JSON.parse(stored);
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
};

const saveMessages = (messages: Message[]) => {
  const toStore: StoredMessage[] = messages.map(m => ({
    ...m,
    timestamp: m.timestamp.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodData>(() => {
    const msgs = loadMessages();
    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user' && m.mood);
    return lastUserMsg?.mood ?? { mood: 'neutral', confidence: 0.5, emoji: '😊' };
  });

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const analyzeMood = async (text: string): Promise<MoodData> => {
    try {
      const response = await fetch(MOOD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        return { mood: 'neutral', confidence: 0.5, emoji: '😊' };
      }

      const moodData = await response.json();
      return moodData;
    } catch (error) {
      console.error('Mood analysis error:', error);
      return { mood: 'neutral', confidence: 0.5, emoji: '😊' };
    }
  };

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    // Analyze mood first
    const moodData = await analyzeMood(input);
    setCurrentMood(moodData);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      mood: moodData,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = '';
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: assistantContent,
          timestamp: new Date(),
        }];
      });
    };

    try {
      const chatMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: chatMessages, mood: moodData.mood }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to Picasso');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. 💙",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentMood({ mood: 'neutral', confidence: 0.5, emoji: '😊' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  }, []);

  return { messages, sendMessage, isLoading, currentMood, clearChat, deleteMessage };
};
