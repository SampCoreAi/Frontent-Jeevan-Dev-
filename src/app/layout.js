import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../app/theme/globalTheme";
import { Providers } from "./providers";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://jeenvandev.com"), 
  title: "Jeenvan Dev - Your Health, Our Priority",
  description:
    "Jeenvan Dev provides online doctor consultations, appointment booking, and secure health record management.",
  keywords:
    "doctor, healthcare, online consultation, appointments, health records, Jeenvan Dev",
  locale: "en_US",
  type: "website",

  icons: {
    icon: "/img/icon.png",
    width:"50%",
    height:"50%"
  },

  openGraph: {
    title: "Jeenvan Dev - Your Health, Our Priority",
    description:
      "Jeenvan Dev provides online doctor consultations, appointment booking, and secure health record management.",
    images: [
      {
        url: "/img/icon.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Jeenvan Dev - Your Health, Our Priority",
    description:
      "Jeenvan Dev provides online doctor consultations, appointment booking, and secure health record management.",
    images: ["/img/icon.png"], 
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ThemeRegistry>{children}</ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
