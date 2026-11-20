import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = "https://mojolaoluwa.vercel.app";
const description =
  "Portfolio of Mojolaoluwa Olanusi, a full-stack developer building real-time web apps with React, TypeScript, Node.js and PostgreSQL, plus 3D, graphic design and video work.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mojolaoluwa Olanusi | Full-Stack Developer & 3D Artist", template: "%s | Mojolaoluwa Olanusi" },
  description,
  keywords: ["full-stack developer", "React", "TypeScript", "Node.js", "PostgreSQL", "Blender", "portfolio", "Nigeria"],
  authors: [{ name: "Mojolaoluwa Olanusi", url: siteUrl }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mojolaoluwa Olanusi",
    title: "Mojolaoluwa Olanusi | Full-Stack Developer & 3D Artist",
    description,
  },
  twitter: { card: "summary_large_image", title: "Mojolaoluwa Olanusi | Full-Stack Developer", description },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mojolaoluwa Olanusi",
  jobTitle: "Full-Stack Developer",
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Ibadan", addressCountry: "NG" },
  sameAs: ["https://github.com/MojolaoluwaOlanusi", "https://www.linkedin.com/in/mojolaoluwa-olanusi"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-950 text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
