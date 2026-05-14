"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SuiviDemandes() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("stringing_requests")
      .select(`
        id,
        status,
        requested_string,
        requested_tension,
        created_at,
        rackets (
          brand,
          model
        ),
        players (
          first_name,
          last_name
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setRequests(data);
    }
    async function updateStatus(id, newStatus) {
  const { error } = await supabase
    .from("stringing_requests")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (!error) {
    fetchRequests();
  }
}
  }

  const statusColors = {
    "Demande créée": "#999",
    "Raquette en attente de dépôt": "#FF9800",
    "Raquette reçue": "#2196F3",
    "Raquette en cours de cordage": "#9C27B0",
    "Raquette cordée": "#4CAF50",
    "Raquette livrée": "#0E1B4D",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#EFF2FF",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ color: "#0E1B4D", marginBottom: "30px" }}>
          Suivi des demandes de cordage
        </h1>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {requests.map((request) => (
            <div
              key={request.id}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, color: "#0E1B4D" }}>
                    {request.rackets?.brand} {request.rackets?.model}
                  </h2>

                  <p style={{ margin: "8px 0", opacity: 0.7 }}>
                    {request.players?.first_name} {request.players?.last_name}
                  </p>

                  <p style={{ margin: "8px 0" }}>
                    Cordage : {request.requested_string}
                  </p>

                  <p style={{ margin: "8px 0" }}>
                    Tension : {request.requested_tension}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <div
    style={{
      background: statusColors[request.status] || "#999",
      color: "white",
      padding: "12px 18px",
      borderRadius: "999px",
      fontWeight: "bold",
      textAlign: "center",
    }}
  >
    {request.status}
  </div>

  <select
    value={request.status}
    onChange={(e) => updateStatus(request.id, e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ddd",
    }}
  >
    <option>Demande créée</option>
    <option>Raquette en attente de dépôt</option>
    <option>Raquette reçue</option>
    <option>Raquette en cours de cordage</option>
    <option>Raquette cordée</option>
    <option>Raquette livrée</option>
  </select>
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
