import { Settings, Moon, Sun, Monitor, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { AppSettings } from '@/hooks/useSettings';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export const SettingsPanel = ({ 
  settings, 
  onSettingChange,
  open,
  onOpenChange,
  showTrigger = true
}: SettingsPanelProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="font-display">Settings</SheetTitle>
          <SheetDescription>Customize your experience</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <ToggleGroup
              type="single"
              value={settings.theme}
              onValueChange={(value) => value && onSettingChange('theme', value as AppSettings['theme'])}
              className="justify-start"
            >
              <ToggleGroupItem value="light" aria-label="Light mode" className="gap-2">
                <Sun className="w-4 h-4" />
                Light
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark mode" className="gap-2">
                <Moon className="w-4 h-4" />
                Dark
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="System theme" className="gap-2">
                <Monitor className="w-4 h-4" />
                Auto
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Voice Settings</Label>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-muted-foreground">Speed</Label>
                  <span className="text-sm text-muted-foreground">{settings.voiceRate.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[settings.voiceRate]}
                  onValueChange={([value]) => onSettingChange('voiceRate', value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-muted-foreground">Pitch</Label>
                  <span className="text-sm text-muted-foreground">{settings.voicePitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[settings.voicePitch]}
                  onValueChange={([value]) => onSettingChange('voicePitch', value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
