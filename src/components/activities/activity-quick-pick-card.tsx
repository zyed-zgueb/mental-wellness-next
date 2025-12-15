"use client";

import {
  Check,
  Flame,
  Pill,
  Brain,
  Dumbbell,
  MessageCircle,
  Moon,
  Utensils,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Activity, ActivityCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const categoryIcons: Record<ActivityCategory, typeof Pill> = {
  medication: Pill,
  meditation: Brain,
  exercise: Dumbbell,
  therapy: MessageCircle,
  sleep: Moon,
  nutrition: Utensils,
  social: Users,
};

const categoryColors: Record<ActivityCategory, string> = {
  medication: "from-blue-500 to-cyan-500",
  meditation: "from-purple-500 to-pink-500",
  exercise: "from-green-500 to-emerald-500",
  therapy: "from-orange-500 to-red-500",
  sleep: "from-indigo-500 to-blue-500",
  nutrition: "from-yellow-500 to-orange-500",
  social: "from-pink-500 to-rose-500",
};

const categoryBadgeColors: Record<ActivityCategory, string> = {
  medication: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  meditation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  exercise: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  therapy: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sleep: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  nutrition: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  social: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

interface ActivityQuickPickCardProps {
  activity: Activity;
  isLogged?: boolean;
  streak?: number;
  onClick: () => void;
}

export function ActivityQuickPickCard({
  activity,
  isLogged = false,
  streak,
  onClick,
}: ActivityQuickPickCardProps) {
  const Icon = categoryIcons[activity.category];
  const isEmoji = activity.icon && /\p{Emoji}/u.test(activity.icon);

  return (
    <Card
      className={cn(
        "relative cursor-pointer overflow-hidden transition-all hover:scale-105 hover:shadow-lg",
        "border-2",
        isLogged ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border hover:border-primary"
      )}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-10 bg-gradient-to-br",
          categoryColors[activity.category]
        )}
      />

      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Header with icon and streak */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br",
              categoryColors[activity.category]
            )}
          >
            {isEmoji ? (
              <span className="text-2xl">{activity.icon}</span>
            ) : (
              <Icon className="h-6 w-6 text-white" />
            )}
          </div>

          {streak !== undefined && streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{streak}</span>
            </div>
          )}
        </div>

        {/* Activity name */}
        <div>
          <h3 className="font-semibold text-base line-clamp-2">{activity.name}</h3>
        </div>

        {/* Footer with badge and check */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("text-xs", categoryBadgeColors[activity.category])}
          >
            {activity.category}
          </Badge>

          {isLogged && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 animate-in zoom-in">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Custom tag indicator */}
        {activity.source === "custom" && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              Custom
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
