"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockJournalEntries } from "@/lib/mock-data";
import type { MoodLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "oldest" | "moodHigh" | "moodLow";

export default function JournalPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Get all unique tags from entries
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockJournalEntries.forEach((entry) => {
      entry.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let entries = [...mockJournalEntries];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Mood filter
    if (selectedMood !== "all") {
      const mood = parseInt(selectedMood);
      entries = entries.filter((entry) => entry.mood === mood);
    }

    // Tag filter
    if (selectedTag !== "all") {
      entries = entries.filter((entry) => entry.tags.includes(selectedTag));
    }

    // Sort
    entries.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.date.getTime() - a.date.getTime();
        case "oldest":
          return a.date.getTime() - b.date.getTime();
        case "moodHigh":
          return b.mood - a.mood;
        case "moodLow":
          return a.mood - b.mood;
        default:
          return 0;
      }
    });

    return entries;
  }, [searchQuery, selectedMood, selectedTag, sortBy]);

  const getMoodColor = (mood: MoodLevel): string => {
    if (mood >= 8) return "bg-mood-excellent";
    if (mood >= 6) return "bg-mood-good";
    if (mood >= 4) return "bg-mood-neutral";
    return "bg-mood-low";
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("journal.title")}
        description={t("journal.description")}
        actions={
          <Link href={`/${locale}/journal/new`}>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              {t("journal.list.newEntry")}
            </Button>
          </Link>
        }
      />

      {/* Filters and Search */}
      <div className="mt-6 space-y-4 sm:mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("journal.list.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Mood Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("journal.list.filterByMood")}
                  </label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("journal.list.allMoods")}
                      </SelectItem>
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((mood) => (
                        <SelectItem key={mood} value={mood.toString()}>
                          {mood} - {t(`tracking.mood.moodLabels.${mood}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("journal.list.filterByTag")}
                  </label>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("journal.list.allTags")}
                      </SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("journal.list.sortBy")}
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        {t("journal.list.sortNewest")}
                      </SelectItem>
                      <SelectItem value="oldest">
                        {t("journal.list.sortOldest")}
                      </SelectItem>
                      <SelectItem value="moodHigh">
                        {t("journal.list.sortMoodHigh")}
                      </SelectItem>
                      <SelectItem value="moodLow">
                        {t("journal.list.sortMoodLow")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entries Count */}
        {filteredEntries.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {filteredEntries.length === 1
              ? t("journal.list.entriesCount.singular", { count: filteredEntries.length })
              : t("journal.list.entriesCount.plural", { count: filteredEntries.length })}
          </p>
        )}

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                {t("journal.list.noEntries")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("journal.list.noEntriesDescription")}
              </p>
              <Link href={`/${locale}/journal/new`}>
                <Button size="lg" className="mt-6 gap-2">
                  <Plus className="h-5 w-5" />
                  {t("journal.list.createFirst")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="group relative overflow-hidden transition-all hover:shadow-lg"
              >
                <Link href={`/${locale}/journal/${entry.id}`}>
                  <CardContent className="p-6">
                    {/* Header with Date and Mood */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {format(entry.date, "PPP", { locale: dateLocale })}
                        </p>
                        {entry.title && (
                          <h3 className="mt-1 line-clamp-2 text-lg font-semibold">
                            {entry.title}
                          </h3>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                          getMoodColor(entry.mood)
                        )}
                      >
                        {entry.mood}
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {truncateContent(entry.content)}
                    </p>

                    {/* Tags */}
                    {entry.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {entry.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Read More */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        {t("journal.list.readMore")} →
                      </span>
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implement edit action
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implement delete action
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
