export const metadata = {
  title: "Badminland Cordage",
  description: "Espace gestion cordage raquette Badminland",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
