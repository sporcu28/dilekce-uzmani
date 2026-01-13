import type { Metadata } from "next";
import { Manrope } from "next/font/google"; 
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dilekceyaz.com'), 
  
  title: {
    default: "Dilekçe Asistanım: AI & PDF | Otomatik Dilekçe Oluşturucu",
    template: "%s | Dilekçe Asistanım"
  },
  description: "Türkiye'nin en gelişmiş yapay zeka dilekçe asistanı. İstifa, kira, boşanma ve tüketici dilekçelerini saniyeler içinde oluşturun, PDF veya Word olarak indirin. Google Play'de de varız!",
  keywords: [
    "dilekçe yaz", "dilekçe örneği", "dilekçe yazma programı", 
    "istifa dilekçesi örneği", "mahkeme dilekçesi", "yapay zeka hukuk", 
    "ücretsiz arzuhalci", "android dilekçe uygulaması"
  ],
  authors: [{ name: "Fomenta" }],
  
  // --- GOOGLE SEARCH CONSOLE DOĞRULAMA KODU ---
  verification: {
    google: '8coEqODpstgF-h--ST3vynMNdi2jLTBkU50-sm6okuk',
  },

  openGraph: {
    title: "Dilekçe Asistanım - 1 Dakikada Hazır",
    description: "Avukata ihtiyaç duymadan, HMK uyumlu profesyonel dilekçeler oluşturun.",
    type: "website",
    locale: "tr_TR",
    siteName: "Dilekçe Asistanım",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google Schema (Yapısal Veri)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dilekçe Asistanım",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Android, iOS, Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "description": "Yapay zeka destekli otomatik dilekçe oluşturma asistanı.",
    "installUrl": "https://play.google.com/store/apps/details?id=com.erhangunes.dilekce"
  };

  return (
    <html lang="tr" className={`${manrope.variable} font-display`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-background-light text-slate-900 antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
