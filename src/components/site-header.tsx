"use client";

import { Heart, LayoutDashboard, Activity, Target, BarChart3, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/components/auth/user-profile";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, usePathname } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations();

  const navigation = [
    {
      name: t("navigation.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("navigation.tracking"),
      href: "/track",
      icon: Activity,
    },
    {
      name: t("navigation.goals"),
      href: "/goals",
      icon: Target,
    },
    {
      name: t("navigation.analytics"),
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: t("navigation.chat"),
      href: "/chat",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        {t("common.skipToContent")}
      </a>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40" role="banner">
        <nav
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                aria-label="MindWell - Go to homepage"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"
                  aria-hidden="true"
                >
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t("common.appName")}
                </span>
              </Link>
            </h1>

            {session && (
              <ul className="hidden md:flex items-center gap-1" role="menubar">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                  const Icon = item.icon;

                  return (
                    <li key={item.name} role="none">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        role="menuitem"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="User actions">
            <LanguageSwitcher />
            <ModeToggle />
            <UserProfile />
          </div>
        </nav>
      </header>
    </>
  );
}
