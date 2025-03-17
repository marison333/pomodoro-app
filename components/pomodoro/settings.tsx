import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimerSettings } from "@/lib/types";

interface SettingsProps {
  settings: TimerSettings;
  onUpdateSettings: (settings: Partial<TimerSettings>) => void;
}

export default function Settings({
  settings,
  onUpdateSettings,
}: SettingsProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const handleChange = (key: keyof TimerSettings, value: number | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="pomodoro">Pomodoro (minutes)</Label>
            <Input
              id="pomodoro"
              type="number"
              min="1"
              max="60"
              value={localSettings.pomodoro}
              onChange={(e) =>
                handleChange("pomodoro", parseInt(e.target.value, 10) || 1)
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="shortBreak">Short Break (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="15"
              value={localSettings.shortBreak}
              onChange={(e) =>
                handleChange("shortBreak", parseInt(e.target.value, 10) || 1)
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="longBreak">Long Break (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min="5"
              max="30"
              value={localSettings.longBreak}
              onChange={(e) =>
                handleChange("longBreak", parseInt(e.target.value, 10) || 5)
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="longBreakInterval">Long Break Interval</Label>
            <Input
              id="longBreakInterval"
              type="number"
              min="1"
              max="10"
              value={localSettings.longBreakInterval}
              onChange={(e) =>
                handleChange(
                  "longBreakInterval",
                  parseInt(e.target.value, 10) || 1
                )
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartBreaks">Auto-start Breaks</Label>
            <Switch
              id="autoStartBreaks"
              checked={localSettings.autoStartBreaks}
              onCheckedChange={(checked) =>
                handleChange("autoStartBreaks", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartPomodoros">Auto-start Pomodoros</Label>
            <Switch
              id="autoStartPomodoros"
              checked={localSettings.autoStartPomodoros}
              onCheckedChange={(checked) =>
                handleChange("autoStartPomodoros", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Sound Notifications</Label>
            <Switch
              id="soundEnabled"
              checked={localSettings.soundEnabled}
              onCheckedChange={(checked) =>
                handleChange("soundEnabled", checked)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
