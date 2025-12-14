"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, X, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { MoodScale } from "@/components/mood-scale";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { MoodLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NewJournalEntryPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dateLocale = locale === "fr" ? fr : enUS;

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string>(() =>
    format(new Date(), "HH:mm")
  );
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(7);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!content.trim()) {
        toast.error(t("journal.error.contentRequired"));
        return;
      }

      setIsSaving(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast.success(t("journal.success.created"), {
        icon: <Sparkles className="h-4 w-4 text-mood-excellent" />,
        duration: 3000,
      });

      setIsSaving(false);

      // Redirect to journal list
      router.push(`/${locale}/journal`);
    },
    [content, t, locale, router]
  );

  const handleCancel = useCallback(() => {
    router.push(`/${locale}/journal`);
  }, [locale, router]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("metadata.journalNew.title")}
        description={t("metadata.journalNew.description")}
      />

      <Card className="mt-6 sm:mt-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("journal.form.title")}</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("journal.form.titlePlaceholder")}
                className="text-lg"
              />
            </div>

            {/* Date and Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("journal.form.date")}</Label>
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
                        <span>{t("journal.form.date")}</span>
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

              <div className="space-y-2">
                <Label htmlFor="time">{t("journal.form.time")}</Label>
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
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                {t("journal.form.content")} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("journal.form.contentPlaceholder")}
                rows={12}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {content.length} caractères
              </p>
            </div>

            {/* Mood Scale */}
            <div className="space-y-2">
              <Label>{t("journal.form.mood")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("journal.form.moodHelper")}
              </p>
              <MoodScale
                value={moodLevel}
                onChange={setMoodLevel}
                showLabel={true}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tag-input">{t("journal.form.tags")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("journal.form.tagsHelper")}
              </p>
              <div className="flex gap-2">
                <Input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={t("journal.form.tagsPlaceholder")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  {t("journal.form.addTag")}
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-background/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Images (UI mockée) */}
            <div className="space-y-2">
              <Label>{t("journal.form.images")}</Label>
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("journal.form.imagesHelper")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                {t("journal.form.cancel")}
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSaving || !content.trim()}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("journal.form.saving")}
                  </>
                ) : (
                  t("journal.form.save")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
