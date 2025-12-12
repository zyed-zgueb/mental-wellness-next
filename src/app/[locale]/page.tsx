import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20">
              <Heart className="h-10 w-10 text-pink-500" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {t("hero.description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/dashboard">{t("hero.cta.start")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="#features">{t("hero.cta.learnMore")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t("features.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-pink-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{t("features.dailyTracking.title")}</h3>
                <p className="text-muted-foreground">{t("features.dailyTracking.description")}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{t("features.aiAssistant.title")}</h3>
                <p className="text-muted-foreground">{t("features.aiAssistant.description")}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{t("features.analytics.title")}</h3>
                <p className="text-muted-foreground">{t("features.analytics.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("cta.description")}</p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/dashboard">{t("cta.button")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}