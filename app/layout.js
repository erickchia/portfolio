import "./globals.css";
export const metadata = {
  metadataBase: new URL("https://portfolio-mrl.pages.dev/"),
  title: "Portfolio Erick",
  description: "Projects, design, and links.",
  openGraph: {
    title: "Portfolio Erick",
    description: "Projects, design, and links.",
    images: [{ url: "/images/picUser.jpeg", width: 1200, height: 630, alt: "Erick" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/picUser.jpeg"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* font stable dari head biar ga flakey */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
