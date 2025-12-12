import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");

  return (
    <div className="container max-w-4xl py-8">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
      />

      <Card className="mt-6">
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
          <p className="text-sm text-muted-foreground">
            {t("lastUpdated")}: {new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("introduction.title")}</h2>
            <p>{t("introduction.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("dataCollection.title")}</h2>
            <p>{t("dataCollection.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>{t("dataCollection.items.account.title")}:</strong> {t("dataCollection.items.account.description")}</li>
              <li><strong>{t("dataCollection.items.health.title")}:</strong> {t("dataCollection.items.health.description")}</li>
              <li><strong>{t("dataCollection.items.usage.title")}:</strong> {t("dataCollection.items.usage.description")}</li>
              <li><strong>{t("dataCollection.items.technical.title")}:</strong> {t("dataCollection.items.technical.description")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("dataUsage.title")}</h2>
            <p>{t("dataUsage.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("dataUsage.items.service")}</li>
              <li>{t("dataUsage.items.personalization")}</li>
              <li>{t("dataUsage.items.communication")}</li>
              <li>{t("dataUsage.items.improvement")}</li>
              <li>{t("dataUsage.items.security")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("dataSharing.title")}</h2>
            <p>{t("dataSharing.content")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>{t("dataSharing.items.providers.title")}:</strong> {t("dataSharing.items.providers.description")}</li>
              <li><strong>{t("dataSharing.items.legal.title")}:</strong> {t("dataSharing.items.legal.description")}</li>
              <li><strong>{t("dataSharing.items.consent.title")}:</strong> {t("dataSharing.items.consent.description")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("dataSecurity.title")}</h2>
            <p>{t("dataSecurity.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("yourRights.title")}</h2>
            <p>{t("yourRights.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>{t("yourRights.items.access.title")}:</strong> {t("yourRights.items.access.description")}</li>
              <li><strong>{t("yourRights.items.correction.title")}:</strong> {t("yourRights.items.correction.description")}</li>
              <li><strong>{t("yourRights.items.deletion.title")}:</strong> {t("yourRights.items.deletion.description")}</li>
              <li><strong>{t("yourRights.items.portability.title")}:</strong> {t("yourRights.items.portability.description")}</li>
              <li><strong>{t("yourRights.items.objection.title")}:</strong> {t("yourRights.items.objection.description")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("cookies.title")}</h2>
            <p>{t("cookies.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("changes.title")}</h2>
            <p>{t("changes.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@mindwell.app<br />
              <strong>{t("contact.address")}:</strong> [Your Company Address]
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
