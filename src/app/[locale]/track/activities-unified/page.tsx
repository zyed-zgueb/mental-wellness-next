"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { LayerToggles } from "@/components/activities/layer-toggles";
import { UnifiedLogDialog } from "@/components/activities/unified-log-dialog";
import { UnifiedTimeline } from "@/components/activities/unified-timeline";
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
import type { UnifiedTimelineEntry, LayerConfig } from "@/lib/unified-timeline";
import { DEFAULT_LAYERS } from "@/lib/unified-timeline";

export default function TrackActivitiesUnifiedPage() {
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [entries, setEntries] = useState<UnifiedTimelineEntry[]>([]);
  const [activeLayers, setActiveLayers] = useState<LayerConfig[]>(DEFAULT_LAYERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultTime, setDefaultTime] = useState<string | undefined>();
  const [defaultDuration, setDefaultDuration] = useState<number | undefined>();
  const [editingEntry, setEditingEntry] = useState<UnifiedTimelineEntry | undefined>();

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

  // Filter entries for selected date
  const todaysEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      const selectedDateNormalized = new Date(selectedDate);
      selectedDateNormalized.setHours(0, 0, 0, 0);
      return entryDate.getTime() === selectedDateNormalized.getTime();
    });
  }, [entries, selectedDate]);

  // Count entries by type for display
  const entryCounts = useMemo(() => {
    const counts = {
      activity: 0,
      mood: 0,
      symptom: 0,
      total: todaysEntries.length,
    };

    todaysEntries.forEach((entry) => {
      if (entry.type === "activity") counts.activity++;
      if (entry.type === "mood") counts.mood++;
      if (entry.type === "symptom") counts.symptom++;
    });

    return counts;
  }, [todaysEntries]);

  // Open dialog for adding new entry (floating button)
  const handleAddClick = useCallback(() => {
    setDefaultTime(undefined);
    setDefaultDuration(undefined);
    setEditingEntry(undefined);
    setDialogOpen(true);
  }, []);

  // Handle time slot click (add entry at specific time)
  const handleTimeSlotClick = useCallback((hour: number, minute: number) => {
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    setDefaultTime(time);
    setDefaultDuration(undefined);
    setEditingEntry(undefined);
    setDialogOpen(true);
  }, []);

  // Handle time slot drag (add entry with duration)
  const handleTimeSlotDrag = useCallback(
    (startHour: number, startMinute: number, durationMinutes: number) => {
      const time = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
      setDefaultTime(time);
      setDefaultDuration(durationMinutes);
      setEditingEntry(undefined);
      setDialogOpen(true);
    },
    []
  );

  // Handle entry click (edit existing entry)
  const handleEntryClick = useCallback((entry: UnifiedTimelineEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  }, []);

  // Create or update entries
  const handleLog = useCallback(
    (newEntries: UnifiedTimelineEntry[]) => {
      if (editingEntry) {
        // Update existing entry
        // Note: Since unified dialog can only edit one type at a time,
        // we only expect one entry in the array
        const updatedEntry = newEntries[0];
        if (updatedEntry) {
          setEntries((prev) =>
            prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
          );
          toast.success("Entrée mise à jour", { duration: 2000 });
        }
      } else {
        // Create new entries
        setEntries((prev) => [...prev, ...newEntries]);

        // Show toast based on what was logged
        if (newEntries.length === 1) {
          const entry = newEntries[0];
          if (entry) {
            const typeLabel =
              entry.type === "activity"
                ? "Activité"
                : entry.type === "mood"
                  ? "Humeur"
                  : "Symptômes";
            toast.success(`${typeLabel} loggée!`, {
              description: `à ${format(entry.timestamp, "HH:mm")}`,
              duration: 2000,
            });
          }
        } else if (newEntries.length > 0 && newEntries[0]) {
          toast.success(`${newEntries.length} entrées loggées!`, {
            description: `à ${format(newEntries[0].timestamp, "HH:mm")}`,
            duration: 2000,
          });
        }
      }

      // Reset state
      setEditingEntry(undefined);
      setDefaultTime(undefined);
      setDefaultDuration(undefined);
    },
    [editingEntry]
  );

  // Delete entry
  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast.success("Entrée supprimée", { duration: 2000 });
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Suivi Unifié - Timeline"
        description="Trackez activités, humeur et symptômes sur une même timeline • Cliquez pour ajouter • Glissez pour définir une durée"
      />

      <div className="mt-6 flex gap-6">
        {/* Sidebar: Layer toggles */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <LayerToggles layers={activeLayers} onChange={setActiveLayers} />

            {/* Stats card */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Statistiques du jour</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">🎯 Activités</span>
                  <span className="font-medium">{entryCounts.activity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">😊 Humeur</span>
                  <span className="font-medium">{entryCounts.mood}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">🤒 Symptômes</span>
                  <span className="font-medium">{entryCounts.symptom}</span>
                </div>
                <div className="pt-2 border-t flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{entryCounts.total}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Header bar: Date picker */}
          <div className="flex items-center justify-between gap-4 mb-6">
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

            {/* Mobile layer toggles */}
            <div className="lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Affichage ({activeLayers.filter((l) => l.visible).length}/
                    {activeLayers.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <LayerToggles layers={activeLayers} onChange={setActiveLayers} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Full-width unified timeline */}
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <UnifiedTimeline
                entries={todaysEntries}
                activeLayers={activeLayers}
                onTimeSlotClick={handleTimeSlotClick}
                onTimeSlotDrag={handleTimeSlotDrag}
                onEntryClick={handleEntryClick}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Floating [+] button */}
      <Button
        size="lg"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        onClick={handleAddClick}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Unified log dialog */}
      <UnifiedLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        quickPickActivities={quickPickActivities}
        defaultTime={defaultTime}
        defaultDuration={defaultDuration}
        editingEntry={editingEntry}
        onLog={handleLog}
        onDelete={handleDelete}
      />
    </div>
  );
}
