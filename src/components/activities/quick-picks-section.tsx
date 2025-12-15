"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Activity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface QuickPicksSectionProps {
  activities: Activity[];
  onAddClick: () => void;
  onQuickPickClick: (activity: Activity) => void;
}

export function QuickPicksSection({
  activities,
  onAddClick,
  onQuickPickClick,
}: QuickPicksSectionProps) {
  return (
    <div className="space-y-3">
      {/* Add button - prominent */}
      <Button
        onClick={onAddClick}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Ajouter événement
      </Button>

      {/* Quick picks - compact cards */}
      <div className="space-y-2">
        {activities.map((activity) => {
          const isEmoji = activity.icon && /\p{Emoji}/u.test(activity.icon);

          return (
            <Card
              key={activity.id}
              className={cn(
                "cursor-pointer transition-all hover:bg-accent hover:shadow-md",
                "border"
              )}
              onClick={() => onQuickPickClick(activity)}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {isEmoji ? (
                    <span className="text-2xl">{activity.icon}</span>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                      <span className="text-sm font-medium">
                        {activity.category?.[0]?.toUpperCase() || "A"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{activity.name}</div>
                  {activity.source === "custom" && (
                    <div className="text-xs text-muted-foreground">Custom</div>
                  )}
                </div>

                {/* Arrow hint */}
                <div className="flex-shrink-0 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Browse all link */}
      <Button
        variant="ghost"
        className="w-full text-sm text-muted-foreground hover:text-foreground"
        onClick={() => {
          // TODO: Open catalog modal
        }}
      >
        Parcourir toutes les activités...
      </Button>
    </div>
  );
}
