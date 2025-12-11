"use client";

import { Slider } from "@/components/ui/slider";
import type { MoodLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface MoodScaleProps {
  value: MoodLevel;
  onChange: (value: MoodLevel) => void;
  className?: string;
  showLabel?: boolean;
}

const moodLabels: Record<MoodLevel, string> = {
  1: "Très bas",
  2: "Bas",
  3: "Un peu bas",
  4: "Moyen-",
  5: "Moyen",
  6: "Moyen+",
  7: "Bon",
  8: "Très bon",
  9: "Excellent",
  10: "Exceptionnel",
};

const moodColors: Record<MoodLevel, string> = {
  1: "bg-mood-very-low",
  2: "bg-mood-very-low",
  3: "bg-mood-low",
  4: "bg-mood-low",
  5: "bg-mood-neutral",
  6: "bg-mood-neutral",
  7: "bg-mood-good",
  8: "bg-mood-good",
  9: "bg-mood-excellent",
  10: "bg-mood-excellent",
};

export function MoodScale({
  value,
  onChange,
  className,
  showLabel = true,
}: MoodScaleProps) {
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
                moodColors[value]
              )}
            />
            <span className="text-sm font-semibold">
              {value} - {moodLabels[value]}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0] as MoodLevel)}
          min={1}
          max={10}
          step={1}
          className="mood-scale-slider"
        />

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>5</span>
          <span>10</span>
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

export function getMoodLabel(mood: MoodLevel): string {
  return moodLabels[mood];
}

export function getMoodColor(mood: MoodLevel): string {
  return moodColors[mood];
}
