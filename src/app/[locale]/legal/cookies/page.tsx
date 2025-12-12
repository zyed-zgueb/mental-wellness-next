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
  const t = await getTranslations({ locale, namespace: "legal.cookies.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.cookies");

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
            <h2 className="text-2xl font-semibold mb-4">{t("whatAreCookies.title")}</h2>
            <p>{t("whatAreCookies.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("howWeUse.title")}</h2>
            <p>{t("howWeUse.intro")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("types.title")}</h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">{t("types.essential.title")}</h3>
              <p>{t("types.essential.description")}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{t("types.essential.items.authentication")}</li>
                <li>{t("types.essential.items.security")}</li>
                <li>{t("types.essential.items.language")}</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">{t("types.functional.title")}</h3>
              <p>{t("types.functional.description")}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{t("types.functional.items.preferences")}</li>
                <li>{t("types.functional.items.theme")}</li>
                <li>{t("types.functional.items.consent")}</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">{t("types.analytics.title")}</h3>
              <p>{t("types.analytics.description")}</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{t("types.analytics.items.usage")}</li>
                <li>{t("types.analytics.items.performance")}</li>
                <li>{t("types.analytics.items.errors")}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("thirdParty.title")}</h2>
            <p>{t("thirdParty.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>{t("thirdParty.items.auth.title")}:</strong> {t("thirdParty.items.auth.description")}</li>
              <li><strong>{t("thirdParty.items.analytics.title")}:</strong> {t("thirdParty.items.analytics.description")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("control.title")}</h2>
            <p>{t("control.intro")}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>{t("control.items.settings.title")}:</strong> {t("control.items.settings.description")}</li>
              <li><strong>{t("control.items.browser.title")}:</strong> {t("control.items.browser.description")}</li>
              <li><strong>{t("control.items.optOut.title")}:</strong> {t("control.items.optOut.description")}</li>
            </ul>
            <p className="mt-4">{t("control.note")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("retention.title")}</h2>
            <p>{t("retention.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("updates.title")}</h2>
            <p>{t("updates.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@mindwell.app
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
