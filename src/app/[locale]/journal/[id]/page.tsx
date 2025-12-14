"use client";

import { useState, useCallback, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { MoodScale } from "@/components/mood-scale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { mockJournalEntries } from "@/lib/mock-data";
import type { MoodLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function JournalEntryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dateLocale = locale === "fr" ? fr : enUS;

  // Find the journal entry
  const journalEntry = useMemo(
    () => mockJournalEntries.find((entry) => entry.id === id),
    [id]
  );

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state (initialized with entry data)
  const [title, setTitle] = useState(journalEntry?.title || "");
  const [content, setContent] = useState(journalEntry?.content || "");
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => journalEntry?.date || new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(() =>
    journalEntry?.date ? format(journalEntry.date, "HH:mm") : format(new Date(), "HH:mm")
  );
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(
    journalEntry?.mood || 7
  );
  const [tags, setTags] = useState<string[]>(journalEntry?.tags || []);
  const [tagInput, setTagInput] = useState("");

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

  const handleSave = useCallback(async () => {
    if (!content.trim()) {
      toast.error(t("journal.error.contentRequired"));
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success toast
    toast.success(t("journal.success.updated"), {
      icon: <Sparkles className="h-4 w-4 text-mood-excellent" />,
      duration: 3000,
    });

    setIsSaving(false);
    setIsEditing(false);
  }, [content, t]);

  const handleDelete = useCallback(async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success toast
    toast.success(t("journal.success.deleted"), {
      duration: 3000,
    });

    // Redirect to journal list
    router.push(`/${locale}/journal`);
  }, [t, locale, router]);

  const handleCancelEdit = useCallback(() => {
    // Reset form to original values
    if (journalEntry) {
      setTitle(journalEntry.title);
      setContent(journalEntry.content);
      setSelectedDate(journalEntry.date);
      setSelectedTime(format(journalEntry.date, "HH:mm"));
      setMoodLevel(journalEntry.mood);
      setTags(journalEntry.tags);
    }
    setIsEditing(false);
  }, [journalEntry]);

  const getMoodColor = (mood: MoodLevel): string => {
    if (mood >= 8) return "bg-mood-excellent";
    if (mood >= 6) return "bg-mood-good";
    if (mood >= 4) return "bg-mood-neutral";
    return "bg-mood-low";
  };

  // Entry not found
  if (!journalEntry) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold">{t("journal.view.notFound")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("journal.view.notFoundDescription")}
            </p>
            <Link href={`/${locale}/journal`}>
              <Button className="mt-6" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("journal.view.back")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <Link href={`/${locale}/journal`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("journal.view.back")}
          </Button>
        </Link>
        {!isEditing && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {!isEditing ? (
            /* View Mode */
            <div className="space-y-6">
              {/* Title */}
              {title && (
                <h1 className="text-3xl font-bold">{title}</h1>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, "PPP", { locale: dateLocale })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedTime}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                      getMoodColor(moodLevel)
                    )}
                  >
                    {moodLevel}
                  </div>
                  <span>{t("journal.view.mood")}: {t(`tracking.mood.moodLabels.${moodLevel}`)}</span>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {content}
                </p>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-4 text-xs text-muted-foreground">
                <p>{t("journal.view.createdAt")}: {format(journalEntry.date, "PPP 'à' HH:mm", { locale: dateLocale })}</p>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-6"
            >
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
              </div>

              {/* Mood Scale */}
              <div className="space-y-2">
                <Label>{t("journal.form.mood")}</Label>
                <MoodScale
                  value={moodLevel}
                  onChange={setMoodLevel}
                  showLabel={true}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tag-input">{t("journal.form.tags")}</Label>
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
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
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

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("journal.form.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("journal.form.confirmDeleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("journal.form.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("journal.form.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
