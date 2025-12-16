"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Lock, TrendingUp, Target, BookOpen, Sparkles, Plus, BarChart3, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserProfile } from "@/components/auth/user-profile";
import { MoodScale } from "@/components/mood-scale";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import {
  mockGoals,
  mockJournalEntries,
  mockStats,
  getRecentMoodData,
  type MoodLevel,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [currentMood, setCurrentMood] = useState<MoodLevel>(4);
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? fr : enUS;

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-muted-foreground">{tCommon("loading")}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">{t("../auth.restrictedAccess")}</h1>
            <p className="text-muted-foreground mb-6">
              {t("../auth.mustSignIn")}
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  const recentMoodData = getRecentMoodData(7);
  const chartData = recentMoodData.map((entry) => ({
    date: format(entry.date, "dd/MM", { locale: dateLocale }),
    humeur: entry.mood,
  }));

  const firstName = session.user.name?.split(" ")[0] || (locale === "fr" ? "là" : "there");
  const currentDate = format(new Date(), "EEEE d MMMM yyyy", { locale: dateLocale });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <PageHeader
          title={t("greeting", { name: firstName })}
          description={currentDate}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("currentStreak")}
          value={`${mockStats.currentStreak} ${t("days")}`}
          icon={TrendingUp}
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title={t("averageMood")}
          value={mockStats.averageMood}
          icon={Target}
          trend={mockStats.trend}
          trendValue="0.5"
        />
        <StatCard
          title={t("totalEntries")}
          value={mockStats.totalEntries}
          icon={BookOpen}
        />
        <StatCard
          title={t("bestStreak")}
          value={`${mockStats.longestStreak} ${t("days")}`}
          icon={Sparkles}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Mood Check */}
          <Card>
            <CardHeader>
              <CardTitle>{t("howFeeling")}</CardTitle>
              <CardDescription>
                {t("quickMoodCheck")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MoodScale value={currentMood} onChange={setCurrentMood} />
              <Button className="w-full" size="lg">
                {t("saveMood")}
              </Button>
            </CardContent>
          </Card>

          {/* Mood Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("moodTrend")}</CardTitle>
              <CardDescription>
                {t("moodTrend")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      domain={[1, 10]}
                      className="text-xs"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="humeur"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Journal Entries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("recentJournal")}</CardTitle>
                <CardDescription>
                  {t("recentJournal")}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/journal">{t("viewStats")}</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockJournalEntries.slice(0, 3).map((entry, index) => (
                <div key={entry.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{entry.title}</h4>
                      <Badge variant="secondary">
                        {format(entry.date, "dd MMM", { locale: dateLocale })}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                    <div className="flex gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insight */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>{t("aiInsight")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {t("aiMessage")}
              </p>
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("activeGoals")}</CardTitle>
                <CardDescription>
                  {t("activeGoals")}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/goals">{t("viewStats")}</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {goal.checkIns} check-ins
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {goal.progress}% {t("progress")}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/journal/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("newJournal")}
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("openChat")}
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t("viewStats")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
