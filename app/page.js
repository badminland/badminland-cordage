export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0E1B4D",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Badminland Cordage
      </h1>

      <p style={{ fontSize: "20px", opacity: 0.8 }}>
        Espace gestion cordage raquette
      </p>
    </main>
  );
}
