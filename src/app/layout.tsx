// Optional: if you have global CSS

export const metadata = {
  title: 'My Mini App',
  description: 'Snake game and more',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
