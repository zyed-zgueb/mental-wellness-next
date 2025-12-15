"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { ActivityLogDialog } from "@/components/activities/activity-log-dialog";
import { InteractiveTimeline } from "@/components/activities/interactive-timeline";
import type { TimelineLog } from "@/components/activities/timeline-entry";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  mockAllActivities,
  mockUserActivityPreferences,
  type Activity,
} from "@/lib/mock-data";

export default function TrackActivitiesPageV2() {
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [logs, setLogs] = useState<TimelineLog[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [defaultTime, setDefaultTime] = useState<string | undefined>();
  const [defaultDuration, setDefaultDuration] = useState<number | undefined>();
  const [editingLog, setEditingLog] = useState<TimelineLog | undefined>();

  // Get quick pick activities (user's favorites)
  const quickPickActivities = useMemo(() => {
    const quickPickIds = mockUserActivityPreferences
      .filter((pref) => pref.isQuickPick)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((pref) => pref.activityId);

    return quickPickIds
      .map((id) => mockAllActivities.find((act) => act.id === id))
      .filter((act): act is Activity => act !== undefined);
  }, []);

  // Filter logs for selected date
  const todaysLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);
      const selectedDateNormalized = new Date(selectedDate);
      selectedDateNormalized.setHours(0, 0, 0, 0);
      return logDate.getTime() === selectedDateNormalized.getTime();
    });
  }, [logs, selectedDate]);

  // Open dialog for adding new activity (floating button)
  const handleAddClick = useCallback(() => {
    setSelectedActivity(undefined);
    setDefaultTime(undefined);
    setDefaultDuration(undefined);
    setEditingLog(undefined);
    setDialogOpen(true);
  }, []);

  // Handle time slot click (add activity at specific time)
  const handleTimeSlotClick = useCallback((hour: number, minute: number) => {
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    setSelectedActivity(undefined);
    setDefaultTime(time);
    setDefaultDuration(undefined);
    setEditingLog(undefined);
    setDialogOpen(true);
  }, []);

  // Handle time slot drag (add activity with duration)
  const handleTimeSlotDrag = useCallback(
    (startHour: number, startMinute: number, durationMinutes: number) => {
      const time = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
      setSelectedActivity(undefined);
      setDefaultTime(time);
      setDefaultDuration(durationMinutes);
      setEditingLog(undefined);
      setDialogOpen(true);
    },
    []
  );

  // Handle activity click (edit existing activity)
  const handleActivityClick = useCallback((log: TimelineLog) => {
    // For now, we'll implement simple inline editing via a dialog
    // In future, could support inline editing
    setEditingLog(log);
    setDialogOpen(true);
  }, []);

  // Create or update log
  const handleLog = useCallback(
    (logData: {
      activityId: string;
      timestamp: Date;
      duration?: number;
      intensity?: 1 | 2 | 3 | 4 | 5;
      note?: string;
    }) => {
      if (editingLog) {
        // Update existing log
        const updatedLog: TimelineLog = {
          ...editingLog,
          ...logData,
        };
        setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));
        toast.success("Activité mise à jour", { duration: 2000 });
      } else {
        // Create new log
        const newLog: TimelineLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          ...logData,
        };
        setLogs((prev) => [...prev, newLog]);
        toast.success("Activité loggée!", {
          description: `${mockAllActivities.find((a) => a.id === logData.activityId)?.name} à ${format(logData.timestamp, "HH:mm")}`,
          duration: 2000,
        });
      }

      // Reset state
      setEditingLog(undefined);
      setDefaultTime(undefined);
      setDefaultDuration(undefined);
    },
    [editingLog]
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Suivi d'Activités & Habitudes"
        description="Cliquez sur la timeline pour ajouter une activité • Glissez pour définir une durée"
      />

      {/* Header bar: Date picker + count */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP", { locale: dateLocale })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              initialFocus
              locale={dateLocale}
            />
          </PopoverContent>
        </Popover>

        <div className="text-sm text-muted-foreground">
          {todaysLogs.length} {todaysLogs.length === 1 ? "activité" : "activités"}
        </div>
      </div>

      {/* Full-width interactive timeline */}
      <div className="mt-6 rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <InteractiveTimeline
            logs={todaysLogs}
            onTimeSlotClick={handleTimeSlotClick}
            onTimeSlotDrag={handleTimeSlotDrag}
            onActivityClick={handleActivityClick}
          />
        </div>
      </div>

      {/* Floating [+] button */}
      <Button
        size="lg"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        onClick={handleAddClick}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Activity log dialog with quick picks as chips */}
      <ActivityLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        quickPickActivities={quickPickActivities}
        {...(selectedActivity ? { preselectedActivity: selectedActivity } : {})}
        {...(defaultTime ? { defaultTime } : {})}
        {...(defaultDuration ? { defaultDuration } : {})}
        {...(editingLog ? { editingLog } : {})}
        onLog={handleLog}
        onDelete={(id) => {
          setLogs((prev) => prev.filter((log) => log.id !== id));
          toast.success("Activité supprimée", { duration: 2000 });
        }}
      />
    </div>
  );
}
