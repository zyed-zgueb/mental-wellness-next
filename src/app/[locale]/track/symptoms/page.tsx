"use client";

import { useState, useMemo, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Sparkles, Activity } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { SymptomType, SymptomRecord, SeverityLevel } from "@/lib/mock-data";
import { mockSymptomData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SYMPTOMS: SymptomType[] = [
  "headache",
  "fatigue",
  "muscle_tension",
  "stomach_ache",
  "insomnia",
  "heart_racing",
  "dizziness",
  "back_pain",
  "chest_tightness",
  "nausea",
];

const getSeverityColor = (severity: SeverityLevel) => {
  const colors = {
    1: "bg-yellow-500/20 border-yellow-500/50",
    2: "bg-orange-500/20 border-orange-500/50",
    3: "bg-red-500/20 border-red-500/50",
    4: "bg-red-600/30 border-red-600/60",
    5: "bg-red-700/40 border-red-700/70",
  };
  return colors[severity];
};

export default function TrackSymptomsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomRecord[]>([]);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() => new Date());

  // Get symptom entry for a specific date
  const getSymptomEntryForDate = useCallback((date: Date) => {
    return mockSymptomData.find((entry) => isSameDay(entry.date, date));
  }, []);

  // Get recent entries (last 5)
  const recentEntries = useMemo(
    () => mockSymptomData.slice(-5).reverse(),
    []
  );

  // Generate calendar heatmap data
  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const handleSymptomToggle = useCallback((symptom: SymptomType) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.symptom === symptom);
      if (exists) {
        return prev.filter((s) => s.symptom !== symptom);
      } else {
        return [...prev, { symptom, severity: 3 }];
      }
    });
  }, []);

  const handleSeverityChange = useCallback(
    (symptom: SymptomType, severity: number) => {
      setSelectedSymptoms((prev) =>
        prev.map((s) =>
          s.symptom === symptom ? { ...s, severity: severity as SeverityLevel } : s
        )
      );
    },
    []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success toast
    toast.success(t("tracking.symptoms.success.title"), {
      description: t("tracking.symptoms.success.message"),
      icon: <Sparkles className="h-4 w-4 text-mood-excellent" />,
      duration: 3000,
    });

    // Reset form
    setSelectedSymptoms([]);
    setNote("");
    setIsSaving(false);
  }, [t]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("tracking.symptoms.title")}
        description={t("tracking.symptoms.description")}
      />

      <div className="mt-6 space-y-6 sm:mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Symptom Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t("tracking.symptoms.form.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>{t("tracking.symptoms.form.date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: dateLocale })
                        ) : (
                          <span>{t("tracking.symptoms.form.date")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={dateLocale}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Symptoms Selection */}
                <div className="space-y-3">
                  <Label>{t("tracking.symptoms.form.selectSymptoms")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("tracking.symptoms.form.symptomsHelper")}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {SYMPTOMS.map((symptom) => {
                      const selected = selectedSymptoms.find(
                        (s) => s.symptom === symptom
                      );
                      return (
                        <div
                          key={symptom}
                          className={cn(
                            "rounded-lg border p-3 transition-all",
                            selected && "border-primary bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={symptom}
                              checked={!!selected}
                              onCheckedChange={() => handleSymptomToggle(symptom)}
                            />
                            <Label
                              htmlFor={symptom}
                              className="flex-1 cursor-pointer text-sm font-medium"
                            >
                              {t(`tracking.symptoms.types.${symptom}`)}
                            </Label>
                          </div>

                          {/* Severity Slider */}
                          {selected && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {t("tracking.symptoms.form.severity")}
                                </span>
                                <span className="text-xs font-medium">
                                  {selected.severity}/5
                                </span>
                              </div>
                              <Slider
                                value={[selected.severity]}
                                onValueChange={(value) =>
                                  handleSeverityChange(symptom, value[0] ?? 1)
                                }
                                min={1}
                                max={5}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{t("tracking.symptoms.severity.mild")}</span>
                                <span>{t("tracking.symptoms.severity.severe")}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-2">
                  <Label htmlFor="note">
                    {t("tracking.symptoms.form.addNote")}
                  </Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("tracking.symptoms.form.notePlaceholder")}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSaving || selectedSymptoms.length === 0}
                >
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("tracking.symptoms.form.saving")}
                    </>
                  ) : (
                    t("tracking.symptoms.form.save")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Calendar Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {t("tracking.symptoms.heatmap.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newMonth = new Date(viewMonth);
                      newMonth.setMonth(newMonth.getMonth() - 1);
                      setViewMonth(newMonth);
                    }}
                  >
                    ←
                  </Button>
                  <span className="text-sm font-medium">
                    {format(viewMonth, "MMMM yyyy", { locale: dateLocale })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newMonth = new Date(viewMonth);
                      newMonth.setMonth(newMonth.getMonth() + 1);
                      setViewMonth(newMonth);
                    }}
                    disabled={viewMonth.getMonth() === new Date().getMonth()}
                  >
                    →
                  </Button>
                </div>

                {/* Heatmap Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day labels */}
                  {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                    <div
                      key={i}
                      className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Fill empty cells for alignment */}
                  {Array.from({ length: ((calendarDays[0]?.getDay() ?? 0) + 6) % 7 }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} className="h-10" />
                    )
                  )}

                  {/* Calendar days */}
                  {calendarDays.map((day) => {
                    const entry = getSymptomEntryForDate(day);
                    const totalSeverity = entry
                      ? entry.symptoms.reduce((sum, s) => sum + s.severity, 0)
                      : 0;
                    const symptomCount = entry ? entry.symptoms.length : 0;

                    let bgColor = "bg-muted";
                    if (symptomCount > 0) {
                      const avgSeverity = totalSeverity / symptomCount;
                      if (avgSeverity >= 4) bgColor = "bg-red-600/70";
                      else if (avgSeverity >= 3) bgColor = "bg-red-500/50";
                      else if (avgSeverity >= 2) bgColor = "bg-orange-500/50";
                      else bgColor = "bg-yellow-500/50";
                    }

                    return (
                      <Popover key={day.toISOString()}>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "h-10 w-full rounded border transition-all hover:scale-110 hover:border-primary",
                              bgColor,
                              isToday(day) && "ring-2 ring-primary ring-offset-1"
                            )}
                          >
                            <span className="text-xs font-medium">
                              {format(day, "d")}
                            </span>
                          </button>
                        </PopoverTrigger>
                        {entry && (
                          <PopoverContent className="w-64" align="start">
                            <div className="space-y-2">
                              <p className="text-sm font-semibold">
                                {format(day, "PPP", { locale: dateLocale })}
                              </p>
                              <div className="space-y-1">
                                {entry.symptoms.map((s) => (
                                  <div
                                    key={s.symptom}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span>
                                      {t(`tracking.symptoms.types.${s.symptom}`)}
                                    </span>
                                    <span className="font-medium">
                                      {s.severity}/5
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {entry.note && (
                                <p className="text-xs text-muted-foreground">
                                  {entry.note}
                                </p>
                              )}
                            </div>
                          </PopoverContent>
                        )}
                      </Popover>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <span className="text-xs text-muted-foreground">
                    {t("tracking.symptoms.heatmap.legend")}:
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded border bg-muted" />
                    <span className="text-xs">{t("tracking.symptoms.heatmap.none")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded border bg-yellow-500/50" />
                    <span className="text-xs">{t("tracking.symptoms.heatmap.mild")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded border bg-orange-500/50" />
                    <span className="text-xs">{t("tracking.symptoms.heatmap.moderate")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded border bg-red-600/70" />
                    <span className="text-xs">{t("tracking.symptoms.heatmap.severe")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>{t("tracking.symptoms.recentEntries.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {t("tracking.symptoms.recentEntries.noEntries")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {format(entry.date, "PPP", { locale: dateLocale })}
                        </p>
                      </div>

                      {/* Symptom count badge */}
                      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                        <Activity className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          {entry.symptoms.length}{" "}
                          {entry.symptoms.length === 1
                            ? t("tracking.symptoms.recentEntries.symptom.singular")
                            : t("tracking.symptoms.recentEntries.symptom.plural")}
                        </span>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.symptoms.map((s) => (
                        <div
                          key={s.symptom}
                          className={cn(
                            "flex items-center gap-2 rounded-full border px-3 py-1",
                            getSeverityColor(s.severity)
                          )}
                        >
                          <span className="text-xs font-medium">
                            {t(`tracking.symptoms.types.${s.symptom}`)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {s.severity}/5
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    {entry.note && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
