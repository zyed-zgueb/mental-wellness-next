"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Pill,
  Brain,
  Dumbbell,
  MessageCircle,
  Moon,
  Utensils,
  Users,
  Flame,
  TrendingUp,
  Check,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import type { ActivityCategory } from "@/lib/mock-data";
import { mockActivities, mockActivityLogs, mockHabits } from "@/lib/mock-data";
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

export default function TrackActivitiesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Group activities by category
  const activitiesByCategory = useMemo(() => {
    const grouped: Record<ActivityCategory, typeof mockActivities> = {
      medication: [],
      meditation: [],
      exercise: [],
      therapy: [],
      sleep: [],
      nutrition: [],
      social: [],
    };

    mockActivities.forEach((activity) => {
      grouped[activity.category].push(activity);
    });

    return grouped;
  }, []);

  // Get last 7 days of activity data
  const recentActivity = useMemo(() => {
    // Group logs by date and count unique activities per day
    const last7Days: Map<string, { date: Date; count: number }> = new Map();
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0] || '';
      if (dateKey) {
        last7Days.set(dateKey, { date, count: 0 });
      }
    }

    mockActivityLogs.forEach((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const dateKey = logDate.toISOString().split('T')[0] || '';
      if (dateKey && last7Days.has(dateKey)) {
        const entry = last7Days.get(dateKey)!;
        entry.count++;
      }
    });

    return Array.from(last7Days.values());
  }, []);

  const handleActivityToggle = useCallback((activityId: string) => {
    setSelectedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(t("tracking.activities.success.title"), {
        description: t("tracking.activities.success.message", {
          count: selectedActivities.size,
        }),
        icon: <Check className="h-4 w-4 text-mood-excellent" />,
        duration: 3000,
      });

      setIsSaving(false);
    },
    [t, selectedActivities.size]
  );

  const categories: ActivityCategory[] = [
    "medication",
    "meditation",
    "exercise",
    "therapy",
    "sleep",
    "nutrition",
    "social",
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("tracking.activities.title")}
        description={t("tracking.activities.description")}
      />

      <div className="mt-6 space-y-6 sm:mt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Tracking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl">
                    {t("tracking.activities.form.title")}
                  </CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "PPP", { locale: dateLocale })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
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
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category];
                    const activities = activitiesByCategory[category];

                    if (activities.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${categoryColors[category]}`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="text-sm font-semibold">
                            {t(`tracking.activities.categories.${category}`)}
                          </h3>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {activities.map((activity) => (
                            <div
                              key={activity.id}
                              className={cn(
                                "flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent",
                                selectedActivities.has(activity.id) &&
                                  "border-primary bg-accent"
                              )}
                            >
                              <Checkbox
                                id={activity.id}
                                checked={selectedActivities.has(activity.id)}
                                onCheckedChange={() => handleActivityToggle(activity.id)}
                              />
                              <Label
                                htmlFor={activity.id}
                                className="flex-1 cursor-pointer text-sm"
                              >
                                {activity.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t("tracking.activities.form.saving")}
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t("tracking.activities.form.save")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Habits & Stats */}
          <div className="space-y-6">
            {/* Habits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="h-5 w-5 text-orange-500" />
                  {t("tracking.activities.habits.title")}
                </CardTitle>
                <CardDescription>{t("tracking.activities.habits.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockHabits.slice(0, 3).map((habit) => {
                  const Icon = categoryIcons[habit.category];
                  return (
                    <div
                      key={habit.id}
                      className="space-y-2 rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Flame className="h-4 w-4" />
                          <span className="text-sm font-bold">{habit.currentStreak}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{t("tracking.activities.habits.progress")}</span>
                          <span>
                            {habit.currentStreak} / {habit.longestStreak} {t("common.days")}
                          </span>
                        </div>
                        <Progress
                          value={(habit.currentStreak / habit.longestStreak) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {t("tracking.activities.recentActivity.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivity.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-12 text-xs text-muted-foreground">
                        {format(day.date, "EEE", { locale: dateLocale })}
                      </span>
                      <div className="flex-1">
                        <div className="h-8 rounded-md bg-accent relative overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                            style={{
                              width: `${(day.count / mockActivities.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right text-sm font-medium">
                        {day.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
