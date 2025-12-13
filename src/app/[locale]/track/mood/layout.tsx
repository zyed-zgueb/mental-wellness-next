import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.trackMood" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function TrackMoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
