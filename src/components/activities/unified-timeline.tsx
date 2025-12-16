"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { mockAllActivities } from "@/lib/mock-data";
import type {
  UnifiedTimelineEntry,
  LayerConfig,
  ActivityEntryData,
  MoodEntryData,
  SymptomEntryData,
} from "@/lib/unified-timeline";
import {
  getEntryBackgroundColor,
  getEntryTextColor,
  getEntryDuration,
  isActivityEntry,
  isMoodEntry,
  isSymptomEntry,
} from "@/lib/unified-timeline";
import { cn } from "@/lib/utils";

// Constants
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;
const SNAP_INTERVAL_MINUTES = 15;
const TIMELINE_HEIGHT_PX = MINUTES_PER_DAY; // 1px per minute
const MIN_DRAG_DURATION_MINUTES = 15;

// Time conversion utilities
const timeToMinutes = (hour: number, minute: number): number => hour * MINUTES_PER_HOUR + minute;

const minutesToTime = (totalMinutes: number): { hour: number; minute: number } => ({
  hour: Math.floor(totalMinutes / MINUTES_PER_HOUR),
  minute: totalMinutes % MINUTES_PER_HOUR,
});

const snapToInterval = (minutes: number, interval: number): number => {
  const snapped = Math.round(minutes / interval) * interval;
  return Math.max(0, Math.min(MINUTES_PER_DAY - 1, snapped));
};

// Symptom labels
const SYMPTOM_LABELS: Record<string, string> = {
  headache: "Mal de tête",
  fatigue: "Fatigue",
  muscle_tension: "Tension musculaire",
  stomach_ache: "Mal de ventre",
  insomnia: "Insomnie",
  heart_racing: "Palpitations",
  dizziness: "Vertiges",
  back_pain: "Mal de dos",
  chest_tightness: "Oppression",
  nausea: "Nausée",
};

// Emotion labels
const EMOTION_LABELS: Record<string, string> = {
  joy: "Joie",
  calm: "Calme",
  energy: "Énergie",
  anxiety: "Anxiété",
  sadness: "Tristesse",
  anger: "Colère",
  neutral: "Neutre",
};

interface UnifiedTimelineProps {
  entries: UnifiedTimelineEntry[];
  activeLayers: LayerConfig[];
  onTimeSlotClick: (hour: number, minute: number) => void;
  onTimeSlotDrag: (startHour: number, startMinute: number, durationMinutes: number) => void;
  onEntryClick: (entry: UnifiedTimelineEntry) => void;
}

export function UnifiedTimeline({
  entries,
  activeLayers,
  onTimeSlotClick,
  onTimeSlotDrag,
  onEntryClick,
}: UnifiedTimelineProps) {
  const [dragStart, setDragStart] = useState<{ hour: number; minute: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ hour: number; minute: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Generate 24-hour slots
  const hours = useMemo(() => Array.from({ length: HOURS_PER_DAY }, (_, i) => i), []);

  // Filter entries based on active layers
  const visibleEntries = useMemo(() => {
    const visibleTypes = new Set(activeLayers.filter((l) => l.visible).map((l) => l.id));
    return entries.filter((entry) => visibleTypes.has(entry.type));
  }, [entries, activeLayers]);

  // Calculate position and height for entry blocks
  const getEntryStyle = useCallback((entry: UnifiedTimelineEntry) => {
    const totalMinutes = timeToMinutes(
      entry.timestamp.getHours(),
      entry.timestamp.getMinutes()
    );
    const topPercent = (totalMinutes / MINUTES_PER_DAY) * 100;

    // Height based on duration, default to 30 minutes if not specified
    const duration = getEntryDuration(entry) || 30;
    const heightPercent = (duration / MINUTES_PER_DAY) * 100;

    return {
      top: `${topPercent}%`,
      height: `${Math.max(heightPercent, 2)}%`, // Minimum 2% for visibility
    };
  }, []);

  // Handle click on empty time slot
  const handleTimeSlotClick = useCallback(
    (hour: number, minute: number, e: React.MouseEvent) => {
      if (isDragging) return;

      const target = e.target as HTMLElement;
      if (target.closest("[data-entry-block]")) return;

      onTimeSlotClick(hour, minute);
    },
    [onTimeSlotClick, isDragging]
  );

  // Calculate hour and minute from mouse position with snapping
  const getTimeFromMousePosition = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return null;

    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMinutes = (y / rect.height) * MINUTES_PER_DAY;
    const snappedMinutes = snapToInterval(totalMinutes, SNAP_INTERVAL_MINUTES);

    return minutesToTime(snappedMinutes);
  }, []);

  // Mouse down - start drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-entry-block]")) return;

      const time = getTimeFromMousePosition(e);
      if (time) {
        setDragStart(time);
        setIsDragging(true);
      }
    },
    [getTimeFromMousePosition]
  );

  // Mouse move - update drag end
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !dragStart) return;

      const time = getTimeFromMousePosition(e);
      if (time) {
        setDragEnd(time);
      }
    },
    [isDragging, dragStart, getTimeFromMousePosition]
  );

  // Mouse up - complete drag
  const handleMouseUp = useCallback(() => {
    if (dragStart && dragEnd && isDragging) {
      const startMinutes = timeToMinutes(dragStart.hour, dragStart.minute);
      const endMinutes = timeToMinutes(dragEnd.hour, dragEnd.minute);

      if (Math.abs(endMinutes - startMinutes) >= MIN_DRAG_DURATION_MINUTES) {
        const actualStart = Math.min(startMinutes, endMinutes);
        const actualEnd = Math.max(startMinutes, endMinutes);
        const duration = actualEnd - actualStart;

        const { hour: startHour, minute: startMinute } = minutesToTime(actualStart);

        onTimeSlotDrag(startHour, startMinute, duration);
      }
    }

    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
  }, [dragStart, dragEnd, isDragging, onTimeSlotDrag]);

  // Calculate drag selection visual
  const dragSelection = useMemo(() => {
    if (!dragStart || !dragEnd) return null;

    const startMinutes = timeToMinutes(dragStart.hour, dragStart.minute);
    const endMinutes = timeToMinutes(dragEnd.hour, dragEnd.minute);
    const topMinutes = Math.min(startMinutes, endMinutes);
    const bottomMinutes = Math.max(startMinutes, endMinutes);
    const durationMinutes = bottomMinutes - topMinutes;

    const topPercent = (topMinutes / MINUTES_PER_DAY) * 100;
    const heightPercent = (durationMinutes / MINUTES_PER_DAY) * 100;

    return {
      style: {
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
      },
      duration: durationMinutes,
    };
  }, [dragStart, dragEnd]);

  // Reset drag on mouse leave
  useEffect(() => {
    const handleMouseLeave = () => {
      if (isDragging) {
        setDragStart(null);
        setDragEnd(null);
        setIsDragging(false);
      }
    };

    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener("mouseleave", handleMouseLeave);
      return () => timeline.removeEventListener("mouseleave", handleMouseLeave);
    }
    return undefined;
  }, [isDragging]);

  // Render entry content based on type
  const renderEntryContent = (entry: UnifiedTimelineEntry) => {
    if (isActivityEntry(entry)) {
      const data = entry.data as ActivityEntryData;
      const activity = mockAllActivities.find((a) => a.id === data.activityId);
      if (!activity) return null;

      const isEmoji = activity.icon && /\p{Emoji}/u.test(activity.icon);

      return (
        <>
          <div className="flex-shrink-0">
            {isEmoji ? (
              <span className="text-lg">{activity.icon}</span>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                <span className="text-xs">{activity.category?.[0]?.toUpperCase() || "A"}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{activity.name}</div>
            <div className="text-xs text-muted-foreground">
              {format(entry.timestamp, "HH:mm")}
              {data.duration && ` • ${data.duration} min`}
              {data.intensity && ` • ${data.intensity}/5`}
            </div>
            {data.note && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{data.note}</div>
            )}
          </div>
        </>
      );
    }

    if (isMoodEntry(entry)) {
      const data = entry.data as MoodEntryData;
      const emotionLabels = data.emotions
        .map((e) => EMOTION_LABELS[e] || e)
        .slice(0, 2)
        .join(", ");

      return (
        <>
          <div className="flex-shrink-0">
            <span className="text-lg">😊</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Humeur: {data.mood}/10</div>
            <div className="text-xs text-muted-foreground">
              {format(entry.timestamp, "HH:mm")}
              {data.duration && ` • ${data.duration} min`}
            </div>
            {emotionLabels && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {emotionLabels}
              </div>
            )}
            {data.note && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{data.note}</div>
            )}
          </div>
        </>
      );
    }

    if (isSymptomEntry(entry)) {
      const data = entry.data as SymptomEntryData;
      const symptomCount = data.symptoms.length;
      const firstSymptom = data.symptoms[0];
      const symptomLabel = firstSymptom
        ? SYMPTOM_LABELS[firstSymptom.type] || firstSymptom.type
        : "";

      return (
        <>
          <div className="flex-shrink-0">
            <span className="text-lg">🤒</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">
              {symptomCount === 1 ? symptomLabel : `${symptomCount} symptômes`}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(entry.timestamp, "HH:mm")}
              {data.duration && ` • ${data.duration} min`}
            </div>
            {firstSymptom && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                Sévérité: {firstSymptom.severity}/5
              </div>
            )}
            {data.note && (
              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{data.note}</div>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      ref={timelineRef}
      className="relative select-none"
      style={{ height: `${TIMELINE_HEIGHT_PX}px` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Hour grid background */}
      <div className="absolute inset-0">
        {hours.map((hour) => (
          <div
            key={hour}
            className={cn(
              "absolute left-0 right-0 flex items-start border-t border-border transition-colors",
              isDragging ? "pointer-events-none" : "hover:bg-accent/20 cursor-pointer"
            )}
            style={{
              top: `${(hour / HOURS_PER_DAY) * 100}%`,
              height: `${(1 / HOURS_PER_DAY) * 100}%`,
            }}
            onClick={(e) => handleTimeSlotClick(hour, 0, e)}
          >
            {/* Hour label */}
            <div className="sticky top-0 w-16 flex-shrink-0 text-sm font-medium text-muted-foreground pt-1 px-2">
              {String(hour).padStart(2, "0")}:00
            </div>

            {/* Time slot content area */}
            <div className="flex-1 h-full relative">
              {/* Half-hour line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Drag selection overlay */}
      {dragSelection && (
        <div
          className="absolute left-16 right-0 bg-primary/20 border-2 border-primary rounded-md pointer-events-none z-10"
          style={dragSelection.style}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-primary bg-background/90 px-2 py-1 rounded">
              {dragSelection.duration} min
            </span>
          </div>
        </div>
      )}

      {/* Entry blocks */}
      <div className="absolute left-16 right-0 top-0 bottom-0">
        {visibleEntries.map((entry) => {
          const style = getEntryStyle(entry);
          const bgColor = getEntryBackgroundColor(entry.type);
          const textColor = getEntryTextColor(entry.type);

          return (
            <div
              key={entry.id}
              data-entry-block
              className={cn(
                "absolute left-2 right-2 rounded-lg border-2 bg-card shadow-sm",
                "hover:shadow-md transition-all cursor-pointer overflow-hidden",
                bgColor
              )}
              style={style}
              onClick={() => onEntryClick(entry)}
            >
              <div className={cn("h-full flex items-start gap-2 p-2", textColor)}>
                {renderEntryContent(entry)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {visibleEntries.length === 0 && !isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Card className="border-dashed max-w-md">
            <div className="p-8 text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                Cliquez sur une heure pour commencer
              </p>
              <p className="text-sm text-muted-foreground">
                Ou cliquez + glissez pour créer une entrée avec durée
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
