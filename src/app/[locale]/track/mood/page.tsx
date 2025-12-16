"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Sparkles, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmotionIcon } from "@/components/emotion-icon";
import { MoodScale } from "@/components/mood-scale";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { EmotionType, MoodLevel } from "@/lib/mock-data";
import { mockMoodData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const EMOTIONS: EmotionType[] = [
  "joy",
  "calm",
  "energy",
  "anxiety",
  "sadness",
  "anger",
  "neutral",
];

export default function TrackMoodPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  // Form state - use lazy initialization for Date objects
  const [isPeriodMode, setIsPeriodMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string>(() =>
    format(new Date(), "HH:mm")
  );
  const [startDate, setStartDate] = useState<Date | undefined>(() => new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(4);
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get recent entries (last 5 from mock data) - memoize to prevent recalculation
  const recentEntries = useMemo(
    () => mockMoodData.slice(-5).reverse(),
    []
  );

  const handleEmotionToggle = useCallback((emotion: EmotionType) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success toast with animation
    toast.success(t("tracking.mood.success.title"), {
      description: isPeriodMode
        ? t("tracking.mood.success.messagePeriod")
        : t("tracking.mood.success.message"),
      icon: <Sparkles className="h-4 w-4 text-mood-excellent" />,
      duration: 3000,
    });

    // Reset form
    setSelectedEmotions([]);
    setNote("");
    setMoodLevel(4);
    setIsSaving(false);
  }, [t, isPeriodMode]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("tracking.mood.title")}
        description={t("tracking.mood.description")}
      />

      <div className="mt-6 space-y-6 sm:mt-8">
        {/* Main Form Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl">
                {isPeriodMode
                  ? t("tracking.mood.periodMode")
                  : t("tracking.mood.quickEntry")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="period-mode" className="text-sm text-muted-foreground">
                  {t("tracking.mood.periodMode")}
                </Label>
                <Switch
                  id="period-mode"
                  checked={isPeriodMode}
                  onCheckedChange={setIsPeriodMode}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date/Time Selection */}
              <div className="grid gap-4 sm:grid-cols-2">
                {!isPeriodMode ? (
                  <>
                    {/* Single Date */}
                    <div className="space-y-2">
                      <Label>{t("tracking.mood.form.date")}</Label>
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
                              <span>{t("tracking.mood.form.date")}</span>
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

                    {/* Time */}
                    <div className="space-y-2">
                      <Label htmlFor="time">{t("tracking.mood.form.time")}</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="time"
                          id="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Period Mode - Date Range */}
                    <div className="space-y-2">
                      <Label>{t("tracking.mood.form.startDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? (
                              format(startDate, "PPP", { locale: dateLocale })
                            ) : (
                              <span>{t("tracking.mood.form.startDate")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={dateLocale}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("tracking.mood.form.endDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? (
                              format(endDate, "PPP", { locale: dateLocale })
                            ) : (
                              <span>{t("tracking.mood.form.endDate")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                              date > new Date() ||
                              (startDate ? date < startDate : false)
                            }
                            initialFocus
                            locale={dateLocale}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                )}
              </div>

              {/* Mood Scale */}
              <div className="space-y-2">
                <MoodScale
                  value={moodLevel}
                  onChange={setMoodLevel}
                  showLabel={true}
                />
              </div>

              {/* Emotions Selection */}
              <div className="space-y-3">
                <Label>{t("tracking.mood.form.selectEmotions")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("tracking.mood.form.emotionsHelper")}
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {EMOTIONS.map((emotion) => (
                    <div
                      key={emotion}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent",
                        selectedEmotions.includes(emotion) &&
                          "border-primary bg-accent"
                      )}
                    >
                      <Checkbox
                        id={emotion}
                        checked={selectedEmotions.includes(emotion)}
                        onCheckedChange={() => handleEmotionToggle(emotion)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-2">
                        <EmotionIcon emotion={emotion} size={20} />
                        <Label
                          htmlFor={emotion}
                          className="cursor-pointer text-sm"
                        >
                          {t(`tracking.mood.emotions.${emotion}`)}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Note */}
              <div className="space-y-2">
                <Label htmlFor="note">
                  {t("tracking.mood.form.addNote")}
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("tracking.mood.form.notePlaceholder")}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("tracking.mood.form.saving")}
                  </>
                ) : (
                  t("tracking.mood.form.save")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>{t("tracking.mood.recentEntries.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                {t("tracking.mood.recentEntries.noEntries")}
              </p>
            ) : (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    {/* Mood Indicator */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mood-good/20 text-lg font-bold">
                        {entry.mood}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("tracking.mood.recentEntries.mood")}
                      </span>
                    </div>

                    {/* Entry Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {format(entry.date, "PPP", { locale: dateLocale })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(entry.date, "HH:mm")}
                        </p>
                      </div>

                      {/* Emotions */}
                      {entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.emotions.map((emotion) => (
                            <div
                              key={emotion}
                              className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1"
                            >
                              <EmotionIcon emotion={emotion} size={14} />
                              <span className="text-xs">
                                {t(`tracking.mood.emotions.${emotion}`)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Note */}
                      {entry.note && (
                        <p className="text-sm text-muted-foreground">
                          {entry.note}
                        </p>
                      )}
                    </div>
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
