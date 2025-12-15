"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockAllActivities } from "@/lib/mock-data";

export interface TimelineLog {
  id: string;
  activityId: string;
  timestamp: Date;
  duration?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

interface TimelineEntryProps {
  log: TimelineLog;
  onUpdate: (log: TimelineLog) => void;
  onDelete: (id: string) => void;
}

export function TimelineEntry({ log, onUpdate, onDelete }: TimelineEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNote, setEditNote] = useState("");

  const activity = mockAllActivities.find((a) => a.id === log.activityId);
  if (!activity) return null;

  const isEmoji = activity.icon && /\p{Emoji}/u.test(activity.icon);

  const handleStartEdit = () => {
    // Initialize edit form with current values
    const hours = String(log.timestamp.getHours()).padStart(2, "0");
    const minutes = String(log.timestamp.getMinutes()).padStart(2, "0");
    setEditTime(`${hours}:${minutes}`);
    setEditDuration(log.duration ? String(log.duration) : "");
    setEditNote(log.note || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    // Parse time
    const timeParts = editTime.split(":");
    const hours = parseInt(timeParts[0] || "0", 10);
    const minutes = parseInt(timeParts[1] || "0", 10);
    const newTimestamp = new Date(log.timestamp);
    newTimestamp.setHours(hours, minutes, 0, 0);

    const updatedLog: TimelineLog = {
      ...log,
      timestamp: newTimestamp,
    };

    if (editDuration) {
      updatedLog.duration = parseInt(editDuration, 10);
    } else {
      delete updatedLog.duration;
    }

    if (editNote.trim()) {
      updatedLog.note = editNote.trim();
    } else {
      delete updatedLog.note;
    }

    onUpdate(updatedLog);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Supprimer cette activité ?")) {
      onDelete(log.id);
    }
  };

  // Read mode
  if (!isEditing) {
    return (
      <div
        className="group flex items-start gap-3 rounded-lg border bg-card p-3 transition-all hover:bg-accent cursor-pointer"
        onClick={handleStartEdit}
      >
        {/* Time */}
        <div className="flex-shrink-0 w-12 text-sm font-medium text-muted-foreground">
          {format(log.timestamp, "HH:mm")}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {isEmoji ? (
            <span className="text-xl">{activity.icon}</span>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted">
              <span className="text-xs">{activity.category?.[0]?.toUpperCase() || "A"}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium">{activity.name}</div>
          {(log.duration || log.note) && (
            <div className="mt-1 text-sm text-muted-foreground">
              {log.duration && <span>{log.duration} min</span>}
              {log.duration && log.note && <span className="mx-1">•</span>}
              {log.note && <span className="line-clamp-1">{log.note}</span>}
            </div>
          )}
        </div>

        {/* Delete button (visible on hover) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="rounded-lg border border-primary bg-card p-4 shadow-lg">
      <div className="space-y-3">
        {/* Time input */}
        <div>
          <label className="text-sm font-medium">Heure</label>
          <Input
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Duration input */}
        <div>
          <label className="text-sm font-medium">Durée (minutes)</label>
          <Input
            type="number"
            min="1"
            max="1440"
            value={editDuration}
            onChange={(e) => setEditDuration(e.target.value)}
            placeholder="Optionnel"
            className="mt-1"
          />
        </div>

        {/* Note input */}
        <div>
          <label className="text-sm font-medium">Note</label>
          <Textarea
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Ajouter une note..."
            rows={2}
            className="mt-1"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Delete button (small, left) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive text-xs"
            onClick={handleDelete}
          >
            supprimer
          </Button>

          {/* Save/Cancel buttons (right, grouped) */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!editTime}
            >
              <Check className="mr-1 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
