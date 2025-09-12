export const metadata = {
  title: "Portfolio Erick",
  description: "Projects, design, and links."
  openGraph: { title: "Portfolio Erick", description: "Projects, design, and links.", images: ["/images/picUser.jpeg"] }
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0,fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif"}}>
        {children}
      </body>
    </html>
  );
}
