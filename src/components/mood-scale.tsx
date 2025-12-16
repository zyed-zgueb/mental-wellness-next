"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { MoodLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MoodScaleProps {
  value: MoodLevel;
  onChange: (value: MoodLevel) => void;
  className?: string;
  showLabel?: boolean;
}

// Labels pour les 5 niveaux principaux
const moodLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Très bas",
  2: "Bas",
  3: "Neutre",
  4: "Bon",
  5: "Très bon",
};

// Emojis pour les 5 niveaux principaux
const moodEmojis: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

// Helper functions (defined here, exported at the end)
function getMoodColorInternal(mood: MoodLevel): string {
  if (mood <= 1.5) return "bg-red-500";
  if (mood <= 2.5) return "bg-orange-500";
  if (mood <= 3.5) return "bg-yellow-500";
  if (mood <= 4.5) return "bg-green-400";
  return "bg-green-600";
}

function getMoodLabelInternal(mood: MoodLevel): string {
  const baseLevel = Math.floor(mood) as 1 | 2 | 3 | 4 | 5;
  const isHalf = mood % 1 !== 0;

  if (isHalf) {
    const nextLevel = (baseLevel + 1) as 1 | 2 | 3 | 4 | 5;
    if (nextLevel <= 5) {
      return `${moodLabels[baseLevel]}-${moodLabels[nextLevel]}`;
    }
  }

  return moodLabels[baseLevel];
}

export function MoodScale({
  value,
  onChange,
  className,
  showLabel = true,
}: MoodScaleProps) {
  // Memoize the value array to prevent infinite re-renders
  const sliderValue = useMemo(() => [value], [value]);

  const mainLevels: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  return (
    <div className={cn("space-y-4", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Niveau d&apos;humeur
          </span>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                getMoodColorInternal(value)
              )}
            />
            <span className="text-sm font-semibold">
              {value} - {getMoodLabelInternal(value)}
            </span>
          </div>
        </div>
      )}

      {/* Boutons principaux (1-5) - Mobile-first */}
      <div className="flex gap-2 justify-between">
        {mainLevels.map((level) => (
          <Button
            key={level}
            type="button"
            variant={value === level ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 h-auto py-3 transition-all min-w-[60px]",
              value === level && "ring-2 ring-primary ring-offset-2 scale-105"
            )}
            onClick={() => onChange(level)}
          >
            <span className="text-2xl">{moodEmojis[level]}</span>
            <span className="text-xs font-medium leading-tight text-center">
              {moodLabels[level]}
            </span>
          </Button>
        ))}
      </div>

      {/* Slider (Desktop + précision) */}
      <div className="relative space-y-2">
        <Slider
          value={sliderValue}
          onValueChange={(values) => onChange(values[0] as MoodLevel)}
          min={1}
          max={5}
          step={0.5}
          className="mood-scale-slider"
        />

        {/* Tick marks for all levels (including half-steps) */}
        <div className="relative h-2">
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((level) => {
            const position = ((level - 1) / (5 - 1)) * 100;
            const isMainLevel = level % 1 === 0;
            return (
              <div
                key={level}
                className={cn(
                  "absolute bg-muted-foreground/30",
                  isMainLevel ? "h-2 w-0.5" : "h-1 w-px"
                )}
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              />
            );
          })}
        </div>

        {/* Labels for main levels */}
        <div className="relative h-4">
          <span className="absolute left-0 -translate-x-1/2 text-xs text-muted-foreground">1</span>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground">3</span>
          <span className="absolute left-full -translate-x-1/2 text-xs text-muted-foreground">5</span>
        </div>
      </div>

      <style jsx>{`
        :global(.mood-scale-slider [role="slider"]) {
          transition: all 0.2s ease-in-out;
        }
        :global(.mood-scale-slider [role="slider"]:hover) {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

// Export helper functions
export function getMoodLabel(mood: MoodLevel): string {
  return getMoodLabelInternal(mood);
}

export function getMoodColor(mood: MoodLevel): string {
  return getMoodColorInternal(mood);
}
