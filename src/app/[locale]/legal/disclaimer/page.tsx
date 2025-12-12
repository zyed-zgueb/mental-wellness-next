import { AlertTriangle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.disclaimer.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.disclaimer");

  return (
    <div className="container max-w-4xl py-8">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
      />

      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("alert.title")}</AlertTitle>
        <AlertDescription>
          {t("alert.description")}
        </AlertDescription>
      </Alert>

      <Card className="mt-6">
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
          <p className="text-sm text-muted-foreground">
            {t("lastUpdated")}: {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("notMedicalAdvice.title")}</h2>
            <p>{t("notMedicalAdvice.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("noSubstitute.title")}</h2>
            <p>{t("noSubstitute.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("aiLimitations.title")}</h2>
            <p>{t("aiLimitations.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("aiLimitations.items.notTherapist")}</li>
              <li>{t("aiLimitations.items.noEmergency")}</li>
              <li>{t("aiLimitations.items.limitations")}</li>
              <li>{t("aiLimitations.items.noGuarantee")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("emergencyResources.title")}</h2>
            <p>{t("emergencyResources.intro")}</p>
            <div className="bg-red-50 dark:bg-red-950 p-6 rounded-lg mt-4 border-2 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-lg mb-3">{t("emergencyResources.crisis.title")}</h3>
              <ul className="space-y-2">
                <li><strong>{t("emergencyResources.crisis.france")}:</strong> 3114 (24/7)</li>
                <li><strong>{t("emergencyResources.crisis.international")}:</strong> 988 (USA), 116 123 (Europe)</li>
                <li><strong>{t("emergencyResources.crisis.emergency")}:</strong> {t("emergencyResources.crisis.emergencyText")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("seekProfessional.title")}</h2>
            <p>{t("seekProfessional.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("seekProfessional.items.persistent")}</li>
              <li>{t("seekProfessional.items.severe")}</li>
              <li>{t("seekProfessional.items.harm")}</li>
              <li>{t("seekProfessional.items.interference")}</li>
              <li>{t("seekProfessional.items.trauma")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("userResponsibility.title")}</h2>
            <p>{t("userResponsibility.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("dataAccuracy.title")}</h2>
            <p>{t("dataAccuracy.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("noLiability.title")}</h2>
            <p className="font-semibold">{t("noLiability.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("modifications.title")}</h2>
            <p>{t("modifications.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
            <p className="mt-2">
              <strong>Email:</strong> support@mindwell.app
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
