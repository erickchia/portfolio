export const metadata = {
  metadataBase: new URL("https://portfolio-mrl.pages.dev"),
  title: "Portfolio Erick",
  description: "Projects, design, and links.",   
  openGraph: {
    title: "Portfolio Erick",
    description: "Projects, design, and links.",
    images: [{ url: "/images/picUser.jpeg", width: 1200, height: 630, alt: "Erick" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/picUser.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
