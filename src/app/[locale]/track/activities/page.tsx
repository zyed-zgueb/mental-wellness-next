"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { ActivityLogDialog } from "@/components/activities/activity-log-dialog";
import { QuickPicksSection } from "@/components/activities/quick-picks-section";
import type { TimelineLog } from "@/components/activities/timeline-entry";
import { TimelineView } from "@/components/activities/timeline-view";
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

  // Open dialog for adding new activity
  const handleAddClick = useCallback(() => {
    setSelectedActivity(undefined);
    setDialogOpen(true);
  }, []);

  // Open dialog with preselected activity (from quick pick)
  const handleQuickPickClick = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  }, []);

  // Create new log
  const handleCreateLog = useCallback(
    (logData: {
      activityId: string;
      timestamp: Date;
      duration?: number;
      intensity?: 1 | 2 | 3 | 4 | 5;
      note?: string;
    }) => {
      const newLog: TimelineLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        ...logData,
      };

      setLogs((prev) => [...prev, newLog]);

      toast.success("Activité loggée!", {
        description: `${mockAllActivities.find((a) => a.id === logData.activityId)?.name} à ${format(logData.timestamp, "HH:mm")}`,
        duration: 2000,
      });
    },
    []
  );

  // Update existing log
  const handleUpdateLog = useCallback((updatedLog: TimelineLog) => {
    setLogs((prev) => prev.map((log) => (log.id === updatedLog.id ? updatedLog : log)));

    toast.success("Activité mise à jour", {
      duration: 2000,
    });
  }, []);

  // Delete log
  const handleDeleteLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));

    toast.success("Activité supprimée", {
      duration: 2000,
    });
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Suivi d'Activités & Habitudes"
        description="Suivez vos activités quotidiennes avec une timeline flexible"
      />

      {/* Date picker */}
      <div className="mt-6 flex items-center gap-4">
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

      {/* Main layout: 2 columns on desktop, stacked on mobile */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px,1fr]">
        {/* Left column: Quick Picks */}
        <div className="order-1 lg:order-1">
          <div className="lg:sticky lg:top-6">
            <h2 className="mb-3 text-lg font-semibold">Quick Picks</h2>
            <QuickPicksSection
              activities={quickPickActivities}
              onAddClick={handleAddClick}
              onQuickPickClick={handleQuickPickClick}
            />
          </div>
        </div>

        {/* Right column: Timeline */}
        <div className="order-2 lg:order-2">
          <h2 className="mb-3 text-lg font-semibold">Timeline du jour</h2>
          <TimelineView
            logs={todaysLogs}
            onUpdateLog={handleUpdateLog}
            onDeleteLog={handleDeleteLog}
          />
        </div>
      </div>

      {/* Activity log dialog */}
      <ActivityLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        {...(selectedActivity ? { preselectedActivity: selectedActivity } : {})}
        onLog={handleCreateLog}
      />
    </div>
  );
}
