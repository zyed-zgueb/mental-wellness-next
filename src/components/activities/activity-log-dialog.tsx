"use client";

import { useState, useEffect } from "react";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockAllActivities, type Activity } from "@/lib/mock-data";

interface ActivityLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedActivity?: Activity;
  defaultTime?: string; // Format: "HH:mm"
  onLog: (log: {
    activityId: string;
    timestamp: Date;
    duration?: number;
    intensity?: 1 | 2 | 3 | 4 | 5;
    note?: string;
  }) => void;
}

export function ActivityLogDialog({
  open,
  onOpenChange,
  preselectedActivity,
  defaultTime,
  onLog,
}: ActivityLogDialogProps) {
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(
    preselectedActivity?.id
  );
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Initialize form when dialog opens
  useEffect(() => {
    if (!open) return;

    // Use requestAnimationFrame to avoid synchronous setState
    requestAnimationFrame(() => {
      if (defaultTime) {
        setTime(defaultTime);
      } else {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setTime(`${hours}:${minutes}`);
      }

      // Set or reset activity ID based on preselected
      if (preselectedActivity) {
        setSelectedActivityId(preselectedActivity.id);
      } else {
        setSelectedActivityId(undefined);
      }

      setDuration("");
      setIntensity("");
      setNote("");
    });
  }, [open, defaultTime, preselectedActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedActivityId || !time) {
      return;
    }

    // Parse time and create timestamp
    const timeParts = time.split(":");
    const hours = parseInt(timeParts[0] || "0", 10);
    const minutes = parseInt(timeParts[1] || "0", 10);
    const timestamp = new Date();
    timestamp.setHours(hours, minutes, 0, 0);

    const logData: {
      activityId: string;
      timestamp: Date;
      duration?: number;
      intensity?: 1 | 2 | 3 | 4 | 5;
      note?: string;
    } = {
      activityId: selectedActivityId,
      timestamp,
    };

    if (duration) {
      logData.duration = parseInt(duration, 10);
    }
    if (intensity) {
      logData.intensity = parseInt(intensity, 10) as 1 | 2 | 3 | 4 | 5;
    }
    if (note.trim()) {
      logData.note = note.trim();
    }

    onLog(logData);

    onOpenChange(false);
  };

  const selectedActivity = mockAllActivities.find((a) => a.id === selectedActivityId);
  const isExercise = selectedActivity?.category === "exercise";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {preselectedActivity ? `Logger: ${preselectedActivity.name}` : "Logger une activité"}
            </DialogTitle>
            <DialogDescription>
              Enregistrez une activité avec l'heure et des détails optionnels.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Activity selector (if not preselected) */}
            {!preselectedActivity && (
              <div className="grid gap-2">
                <Label htmlFor="activity">Activité *</Label>
                <Select
                  value={selectedActivityId || ""}
                  onValueChange={setSelectedActivityId}
                  required
                >
                  <SelectTrigger id="activity">
                    <SelectValue placeholder="Choisir une activité..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAllActivities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        <span className="flex items-center gap-2">
                          {activity.icon && /\p{Emoji}/u.test(activity.icon) && (
                            <span>{activity.icon}</span>
                          )}
                          {activity.name}
                          {activity.source === "custom" && (
                            <span className="text-xs text-muted-foreground">(Custom)</span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Time picker */}
            <div className="grid gap-2">
              <Label htmlFor="time">Heure *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Duration (optional) */}
            <div className="grid gap-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 30"
              />
            </div>

            {/* Intensity (only for exercise) */}
            {isExercise && (
              <div className="grid gap-2">
                <Label htmlFor="intensity">Intensité</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger id="intensity">
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Très léger</SelectItem>
                    <SelectItem value="2">2 - Léger</SelectItem>
                    <SelectItem value="3">3 - Modéré</SelectItem>
                    <SelectItem value="4">4 - Intense</SelectItem>
                    <SelectItem value="5">5 - Très intense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Note (optional) */}
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajouter une note..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={!selectedActivityId || !time}>
              <Check className="mr-2 h-4 w-4" />
              Logger
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
