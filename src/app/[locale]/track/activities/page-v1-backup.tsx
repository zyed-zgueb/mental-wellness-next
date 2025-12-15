"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
} from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { ActivityQuickPickCard } from "@/components/activities/activity-quick-pick-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  mockAllActivities,
  mockUserActivityPreferences,
  mockHabits,
  type Activity,
} from "@/lib/mock-data";

export default function TrackActivitiesPageNew() {
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [loggedActivities, setLoggedActivities] = useState<Set<string>>(new Set());

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

  // Get streaks for quick pick activities
  const activityStreaks = useMemo(() => {
    const streaks: Record<string, number> = {};
    mockHabits.forEach((habit) => {
      streaks[habit.activityId] = habit.currentStreak;
    });
    return streaks;
  }, []);

  const handleQuickLog = useCallback(async (activityId: string) => {
    setLoggedActivities((prev) => new Set(prev).add(activityId));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Activité loggée!", {
      description: "L'activité a été enregistrée avec succès.",
      duration: 2000,
    });
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Suivi d'Activités & Habitudes"
        description="Suivez vos activités quotidiennes et habitudes saines de manière flexible"
      />

      <div className="mt-6 space-y-6 sm:mt-8">
        {/* Header with date picker and search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter activité
            </Button>
          </div>
        </div>

        {/* Quick Picks Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Mes Activités Favorites</h2>
            <p className="text-sm text-muted-foreground">
              Cliquez sur une activité pour la logger rapidement
            </p>
          </div>

          {quickPickActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore d'activités favorites.
                  </p>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Parcourir les activités
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {quickPickActivities.map((activity) => {
                const streak = activityStreaks[activity.id];
                return (
                  <ActivityQuickPickCard
                    key={activity.id}
                    activity={activity}
                    isLogged={loggedActivities.has(activity.id)}
                    {...(streak !== undefined ? { streak } : {})}
                    onClick={() => handleQuickLog(activity.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Placeholder for catalog and other features */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>🚧 En Construction</CardTitle>
            <CardDescription>
              Les fonctionnalités suivantes seront bientôt disponibles:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Catalogue complet avec recherche et filtres</li>
              <li>Création d'activités personnalisées</li>
              <li>Logging détaillé avec timestamp, durée, intensité</li>
              <li>Timeline des activités du jour</li>
              <li>Statistiques et insights</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
