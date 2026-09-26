import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "../app/styles/theme";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <Providers>
          <AppThemeProvider>{children}</AppThemeProvider>
        </Providers>
      </body>
    </html>
  );
}