import { Home, Settings, Trash2, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileBottomNavProps {
  onNewChat: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  hasMessages: boolean;
}

export const MobileBottomNav = ({ 
  onNewChat, 
  onClearChat, 
  onOpenSettings,
  hasMessages 
}: MobileBottomNavProps) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="flex flex-col items-center gap-1 h-auto py-2 px-4 text-muted-foreground hover:text-primary"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span className="text-[10px]">New Chat</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 h-auto py-2 px-4 text-muted-foreground hover:text-primary"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </Button>

        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px]">Clear</span>
          </Button>
        )}
      </div>
    </nav>
  );
};
