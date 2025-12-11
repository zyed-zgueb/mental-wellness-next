import {
  Smile,
  Heart,
  Zap,
  Frown,
  CloudRain,
  Flame,
  Minus,
} from "lucide-react";
import type { EmotionType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface EmotionIconProps {
  emotion: EmotionType;
  size?: number;
  className?: string;
}

const emotionConfig: Record<
  EmotionType,
  { icon: typeof Smile; color: string; label: string }
> = {
  joy: {
    icon: Smile,
    color: "text-mood-excellent",
    label: "Joie",
  },
  calm: {
    icon: Heart,
    color: "text-mood-good",
    label: "Calme",
  },
  energy: {
    icon: Zap,
    color: "text-mood-neutral",
    label: "Énergie",
  },
  anxiety: {
    icon: CloudRain,
    color: "text-mood-low",
    label: "Anxiété",
  },
  sadness: {
    icon: Frown,
    color: "text-mood-very-low",
    label: "Tristesse",
  },
  anger: {
    icon: Flame,
    color: "text-destructive",
    label: "Colère",
  },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
    label: "Neutre",
  },
};

export function EmotionIcon({
  emotion,
  size = 20,
  className,
}: EmotionIconProps) {
  const config = emotionConfig[emotion];
  const Icon = config.icon;

  return (
    <Icon
      size={size}
      className={cn(config.color, className)}
      aria-label={config.label}
    />
  );
}

export function getEmotionLabel(emotion: EmotionType): string {
  return emotionConfig[emotion].label;
}

export function getEmotionColor(emotion: EmotionType): string {
  return emotionConfig[emotion].color;
}
