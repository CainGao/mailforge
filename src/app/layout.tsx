import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "MailForge - AI Trade Email Generator | Write Cold Emails That Get Replies",
  description:
    "Generate professional foreign trade cold emails in 10+ languages in 1 minute. AI-powered development letters for B2B sellers.",
  keywords: [
    "AI email generator",
    "cold email",
    "trade email",
    "development letter",
    "开发信",
    "B2B outreach",
    "foreign trade",
    "AI email writer",
    "business email generator",
    "international trade email",
  ],
  openGraph: {
    title: "MailForge - AI Trade Email Generator",
    description:
      "Generate professional cold emails in 10+ languages in 1 minute",
    url: "https://mail.aisense.top",
    siteName: "MailForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MailForge - AI Trade Email Generator",
    description:
      "Generate professional cold emails in 10+ languages in 1 minute",
  },
};
