"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NouvelleDemande() {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    racket_brand: "",
    racket_model: "",
    requested_string: "",
    requested_tension: "",
    deposit_method: "Dépôt magasin",
    customer_comment: "",
  });

  const [message, setMessage] = useState("");

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitForm(e) {
    e.preventDefault();
    setMessage("Envoi en cours...");

    const { data: player, error: playerError } = await supabase
      .from("players")
      .upsert(
        {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (playerError) {
      setMessage("Erreur profil joueur : " + playerError.message);
      return;
    }

    const { data: racket, error: racketError } = await supabase
      .from("rackets")
      .insert({
        player_id: player.id,
        brand: form.racket_brand,
        model: form.racket_model,
      })
      .select()
      .single();

    if (racketError) {
      setMessage("Erreur raquette : " + racketError.message);
      return;
    }

    const { error: requestError } = await supabase
      .from("stringing_requests")
      .insert({
        player_id: player.id,
        racket_id: racket.id,
        requested_string: form.requested_string,
        requested_tension: form.requested_tension,
        deposit_method: form.deposit_method,
        customer_comment: form.customer_comment,
        status: "Raquette en attente de dépôt",
      });

    if (requestError) {
      setMessage("Erreur demande : " + requestError.message);
      return;
    }

    setMessage("✅ Votre demande de cordage a bien été enregistrée.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#EFF2FF", padding: "30px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", background: "white", borderRadius: "24px", padding: "30px" }}>
        <h1 style={{ color: "#0E1B4D" }}>Nouvelle demande de cordage</h1>
        <p>Remplissez les informations ci-dessous pour déposer une demande de cordage.</p>

        <form onSubmit={submitForm}>
          {[
            ["email", "Email"],
            ["first_name", "Prénom"],
            ["last_name", "Nom"],
            ["phone", "Téléphone"],
            ["racket_brand", "Marque de la raquette"],
            ["racket_model", "Modèle de la raquette"],
            ["requested_string", "Cordage souhaité"],
            ["requested_tension", "Tension souhaitée"],
          ].map(([name, label]) => (
            <div key={name} style={{ marginBottom: "14px" }}>
              <label>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={updateField}
                required={name !== "phone"}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  marginTop: "6px",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "14px" }}>
            <label>Mode de dépôt</label>
            <select
              name="deposit_method"
              value={form.deposit_method}
              onChange={updateField}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: "6px",
              }}
            >
              <option>Dépôt magasin</option>
              <option>Envoi par colis</option>
              <option>Remise sur tournoi</option>
            </select>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label>Commentaire</label>
            <textarea
              name="customer_comment"
              value={form.customer_comment}
              onChange={updateField}
              rows="4"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginTop: "6px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#0E1B4D",
              color: "white",
              padding: "15px 24px",
              borderRadius: "999px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Envoyer la demande
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", fontWeight: "bold", color: "#0E1B4D" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
