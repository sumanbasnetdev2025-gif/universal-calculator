import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calcnepal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "",                   priority: 1.0,  freq: "weekly"  },
    { path: "/date-converter",    priority: 0.9,  freq: "monthly" },
    { path: "/salary-payroll",    priority: 0.9,  freq: "monthly" },
    { path: "/construction",      priority: 0.8,  freq: "monthly" },
    { path: "/land-units",        priority: 0.8,  freq: "monthly" },
    { path: "/financial",         priority: 0.9,  freq: "monthly" },
    { path: "/unit-converter",    priority: 0.8,  freq: "monthly" },
    { path: "/electricity-bill",  priority: 0.9,  freq: "monthly" },
    { path: "/fuel-cost",         priority: 0.8,  freq: "monthly" },
    { path: "/health-lifestyle",  priority: 0.8,  freq: "monthly" },
  ];

  return pages.map(({ path, priority, freq }) => ({
    url:             `${BASE}${path}`,
    lastModified:    new Date(),
    changeFrequency: freq as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));
}