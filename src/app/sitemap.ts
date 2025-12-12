import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const locales = ["fr", "en"];
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/dashboard", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/chat", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/profile", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/legal/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/disclaimer", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/cookies", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for each locale and route
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  return sitemap;
}
