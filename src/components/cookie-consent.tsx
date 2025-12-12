"use client";

import { useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const COOKIE_CONSENT_KEY = "mindwell-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [showBanner, setShowBanner] = useState(() => {
    // Initialize state from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return !consent;
    }
    return false;
  });

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="max-w-4xl mx-auto border-2 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{t("title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            {t("description")}{" "}
            <Link
              href="/legal/cookies"
              className="text-primary hover:underline font-medium"
            >
              {t("learnMore")}
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={acceptAll}
            className="w-full sm:w-auto"
          >
            {t("acceptAll")}
          </Button>
          <Button
            onClick={acceptEssential}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {t("acceptEssential")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
