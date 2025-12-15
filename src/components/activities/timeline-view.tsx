"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimelineEntry, type TimelineLog } from "./timeline-entry";

interface TimelineViewProps {
  logs: TimelineLog[];
  onUpdateLog: (log: TimelineLog) => void;
  onDeleteLog: (id: string) => void;
}

export function TimelineView({ logs, onUpdateLog, onDeleteLog }: TimelineViewProps) {
  // Sort logs by timestamp (most recent first)
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs]);

  // Generate hour markers (every 3 hours + midnight and 23:00)
  const hourMarkers = [0, 6, 12, 18, 23];

  return (
    <div className="relative h-full">
      {/* 24h background with hour lines */}
      <div className="absolute inset-0 pointer-events-none">
        {hourMarkers.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 flex items-center"
            style={{ top: `${(hour / 24) * 100}%` }}
          >
            <div className="w-12 text-xs text-muted-foreground font-medium">
              {String(hour).padStart(2, "0")}:00
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>
        ))}
      </div>

      {/* Timeline entries */}
      <div className="relative space-y-2 pt-2 pb-8">
        {sortedLogs.length === 0 ? (
          <Card className="border-dashed mt-12">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  Votre journée commence ici...
                </p>
                <p className="text-sm text-muted-foreground">
                  Utilisez les Quick Picks ou le bouton [+] pour logger une activité
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedLogs.map((log) => (
            <TimelineEntry
              key={log.id}
              log={log}
              onUpdate={onUpdateLog}
              onDelete={onDeleteLog}
            />
          ))
        )}
      </div>
    </div>
  );
}
