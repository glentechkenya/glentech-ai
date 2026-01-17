import "./globals.css";

export const metadata = {
  title: "glen-Ai",
  description: "Your future AI created by Glen Tech"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
