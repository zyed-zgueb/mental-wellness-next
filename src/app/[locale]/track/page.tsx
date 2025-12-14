import { Smile, Activity, Dumbbell, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("metadata.tracking.title"),
    description: t("metadata.tracking.description"),
  };
}

const trackingPages = [
  {
    id: "mood",
    href: "/track/mood",
    icon: Smile,
    gradient: "from-mood-excellent to-mood-good",
    available: true,
  },
  {
    id: "symptoms",
    href: "/track/symptoms",
    icon: Activity,
    gradient: "from-orange-500 to-red-500",
    available: true,
  },
  {
    id: "activities",
    href: "/track/activities",
    icon: Dumbbell,
    gradient: "from-purple-500 to-pink-500",
    available: false,
  },
] as const;

export default function TrackingPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={t("tracking.hub.title")}
        description={t("tracking.hub.description")}
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trackingPages.map((page) => {
          const Icon = page.icon;
          const isAvailable = page.available;

          const cardContent = (
            <Card
              className={`h-full transition-all ${
                isAvailable
                  ? "hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <CardHeader>
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${page.gradient} shadow-lg`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="flex items-center gap-2">
                  {t(`tracking.hub.pages.${page.id}.title`)}
                  {!isAvailable && (
                    <span className="text-xs font-normal text-muted-foreground">
                      ({t("tracking.hub.comingSoon")})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {t(`tracking.hub.pages.${page.id}.description`)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAvailable ? (
                  <Button className="w-full" variant="default">
                    {t("tracking.hub.startTracking")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    {t("tracking.hub.comingSoon")}
                  </Button>
                )}
              </CardContent>
            </Card>
          );

          if (isAvailable) {
            return (
              <Link key={page.id} href={page.href}>
                {cardContent}
              </Link>
            );
          }

          return <div key={page.id}>{cardContent}</div>;
        })}
      </div>

      {/* Quick Stats or Tips Section */}
      <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">💡 {t("tracking.hub.tip.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("tracking.hub.tip.content")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
