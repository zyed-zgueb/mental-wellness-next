/**
 * Unified Timeline Types
 *
 * Extension du système activities pour supporter plusieurs types d'entries :
 * - Activities (déjà existant)
 * - Mood (humeur + émotions)
 * - Symptoms (symptômes physiques)
 */

import type { MoodLevel, EmotionType, SymptomType, SeverityLevel } from "./mock-data";

// ============================================================================
// Entry Types
// ============================================================================

export type TimelineEntryType = "activity" | "mood" | "symptom";

// ============================================================================
// Activity Entry (existant, étendu)
// ============================================================================

export interface ActivityEntryData {
  activityId: string;
  duration?: number; // Minutes (null = ponctuel)
  intensity?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

// ============================================================================
// Mood Entry (nouveau)
// ============================================================================

export interface MoodEntryData {
  mood: MoodLevel; // 1-10
  emotions: EmotionType[];
  note?: string;

  // Mood peut être :
  // - Ponctuel (duration = null) : "à 14h j'étais à 7/10"
  // - Avec durée (duration = number) : "de 14h à 16h j'étais à 7/10"
  duration?: number; // Minutes (null = ponctuel)
}

// ============================================================================
// Symptom Entry (nouveau)
// ============================================================================

export interface SymptomRecord {
  type: SymptomType;
  severity: SeverityLevel; // 1-5
}

export interface SymptomEntryData {
  symptoms: SymptomRecord[]; // Peut logger plusieurs symptômes en même temps
  note?: string;

  // Symptom peut être :
  // - Ponctuel (duration = null) : "mal de tête à 14h"
  // - Avec durée (duration = number) : "mal de tête de 14h à 16h"
  duration?: number; // Minutes (null = ponctuel)
}

// ============================================================================
// Unified Timeline Entry
// ============================================================================

export interface UnifiedTimelineEntry {
  id: string;
  type: TimelineEntryType;
  timestamp: Date;

  // Type-specific data (union discriminée)
  data: ActivityEntryData | MoodEntryData | SymptomEntryData;
}

// Type guards pour discriminer les unions
export function isActivityEntry(entry: UnifiedTimelineEntry): entry is UnifiedTimelineEntry & { data: ActivityEntryData } {
  return entry.type === "activity";
}

export function isMoodEntry(entry: UnifiedTimelineEntry): entry is UnifiedTimelineEntry & { data: MoodEntryData } {
  return entry.type === "mood";
}

export function isSymptomEntry(entry: UnifiedTimelineEntry): entry is UnifiedTimelineEntry & { data: SymptomEntryData } {
  return entry.type === "symptom";
}

// ============================================================================
// Layer Configuration (pour filtrage visuel)
// ============================================================================

export interface LayerConfig {
  id: TimelineEntryType;
  label: string;
  icon: string;
  color: string; // Tailwind color class (e.g., "blue", "yellow", "red")
  visible: boolean;
}

export const DEFAULT_LAYERS: LayerConfig[] = [
  {
    id: "activity",
    label: "Activités",
    icon: "🎯",
    color: "blue",
    visible: true,
  },
  {
    id: "mood",
    label: "Humeur",
    icon: "😊",
    color: "yellow",
    visible: true,
  },
  {
    id: "symptom",
    label: "Symptômes",
    icon: "🤒",
    color: "red",
    visible: true,
  },
];

// ============================================================================
// Visual Helpers
// ============================================================================

/**
 * Retourne la couleur de fond pour un type d'entry
 */
export function getEntryBackgroundColor(type: TimelineEntryType): string {
  switch (type) {
    case "activity":
      return "bg-blue-500/10 border-blue-500/50 hover:border-blue-500";
    case "mood":
      return "bg-yellow-500/10 border-yellow-500/50 hover:border-yellow-500";
    case "symptom":
      return "bg-red-500/10 border-red-500/50 hover:border-red-500";
  }
}

/**
 * Retourne la couleur de texte pour un type d'entry
 */
export function getEntryTextColor(type: TimelineEntryType): string {
  switch (type) {
    case "activity":
      return "text-blue-700 dark:text-blue-400";
    case "mood":
      return "text-yellow-700 dark:text-yellow-400";
    case "symptom":
      return "text-red-700 dark:text-red-400";
  }
}

/**
 * Retourne le label visuel pour un entry
 * (utilisé pour l'affichage dans la timeline)
 */
export function getEntryDisplayLabel(entry: UnifiedTimelineEntry): string {
  if (isActivityEntry(entry)) {
    // Sera résolu via mockAllActivities.find(a => a.id === entry.data.activityId)
    return ""; // À remplir par le composant
  }

  if (isMoodEntry(entry)) {
    return `Humeur: ${entry.data.mood}/10`;
  }

  if (isSymptomEntry(entry)) {
    const count = entry.data.symptoms.length;
    return count === 1
      ? "1 symptôme"
      : `${count} symptômes`;
  }

  return "";
}

/**
 * Extrait la durée d'un entry (en minutes)
 */
export function getEntryDuration(entry: UnifiedTimelineEntry): number | null {
  if (isActivityEntry(entry)) {
    return entry.data.duration ?? null;
  }

  if (isMoodEntry(entry)) {
    return entry.data.duration ?? null;
  }

  if (isSymptomEntry(entry)) {
    return entry.data.duration ?? null;
  }

  return null;
}

// ============================================================================
// Adapters (conversion depuis types existants)
// ============================================================================

/**
 * Convertit l'ancien TimelineLog en UnifiedTimelineEntry
 */
export function activityLogToUnifiedEntry(log: {
  id: string;
  activityId: string;
  timestamp: Date;
  duration?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}): UnifiedTimelineEntry {
  const data: ActivityEntryData = {
    activityId: log.activityId,
  };

  if (log.duration !== undefined) {
    data.duration = log.duration;
  }
  if (log.intensity !== undefined) {
    data.intensity = log.intensity;
  }
  if (log.note !== undefined) {
    data.note = log.note;
  }

  return {
    id: log.id,
    type: "activity",
    timestamp: log.timestamp,
    data,
  };
}

/**
 * Convertit un UnifiedTimelineEntry de type activity vers l'ancien format
 */
export function unifiedEntryToActivityLog(entry: UnifiedTimelineEntry): {
  id: string;
  activityId: string;
  timestamp: Date;
  duration?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
  note?: string;
} | null {
  if (!isActivityEntry(entry)) return null;

  const result: {
    id: string;
    activityId: string;
    timestamp: Date;
    duration?: number;
    intensity?: 1 | 2 | 3 | 4 | 5;
    note?: string;
  } = {
    id: entry.id,
    activityId: entry.data.activityId,
    timestamp: entry.timestamp,
  };

  if (entry.data.duration !== undefined) {
    result.duration = entry.data.duration;
  }
  if (entry.data.intensity !== undefined) {
    result.intensity = entry.data.intensity;
  }
  if (entry.data.note !== undefined) {
    result.note = entry.data.note;
  }

  return result;
}
