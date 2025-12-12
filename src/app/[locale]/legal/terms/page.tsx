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
  const t = await getTranslations({ locale, namespace: "legal.terms.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.terms");

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
            <h2 className="text-2xl font-semibold mb-4">{t("acceptance.title")}</h2>
            <p>{t("acceptance.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("description.title")}</h2>
            <p>{t("description.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("account.title")}</h2>
            <p>{t("account.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("account.items.accuracy")}</li>
              <li>{t("account.items.security")}</li>
              <li>{t("account.items.responsibility")}</li>
              <li>{t("account.items.notification")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("userContent.title")}</h2>
            <p>{t("userContent.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("userContent.items.ownership")}</li>
              <li>{t("userContent.items.license")}</li>
              <li>{t("userContent.items.responsibility")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("prohibitedUse.title")}</h2>
            <p>{t("prohibitedUse.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>{t("prohibitedUse.items.illegal")}</li>
              <li>{t("prohibitedUse.items.harmful")}</li>
              <li>{t("prohibitedUse.items.spam")}</li>
              <li>{t("prohibitedUse.items.interference")}</li>
              <li>{t("prohibitedUse.items.impersonation")}</li>
              <li>{t("prohibitedUse.items.automation")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("intellectualProperty.title")}</h2>
            <p>{t("intellectualProperty.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("termination.title")}</h2>
            <p>{t("termination.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("disclaimers.title")}</h2>
            <p className="font-semibold uppercase">{t("disclaimers.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("limitation.title")}</h2>
            <p>{t("limitation.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("modifications.title")}</h2>
            <p>{t("modifications.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("governingLaw.title")}</h2>
            <p>{t("governingLaw.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
            <p className="mt-2">
              <strong>Email:</strong> legal@mindwell.app
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
