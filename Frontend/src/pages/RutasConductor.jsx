import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function RutasConductor() {
  useEffect(() => {
    const map = L.map("map").setView([4.711, -74.0721], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const paradas = [
      { nombre: "Juan Pérez", coords: [4.653, -74.083] },
      { nombre: "Ana Gómez", coords: [4.667, -74.11] },
      { nombre: "Luis Torres", coords: [4.7, -74.05] },
      { nombre: "María López", coords: [4.76, -74.03] },
    ];

    paradas.forEach((p) => {
      L.marker(p.coords).addTo(map).bindPopup("Parada: " + p.nombre);
    });

    L.Routing.control({
      waypoints: paradas.map((p) => L.latLng(p.coords[0], p.coords[1])),
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
    }).addTo(map);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div id="sidebar" style={{ width: "320px", background: "#111", color: "#fff", padding: "20px" }}>
        <div id="logo" style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="../img/Logo.png"
            alt="Logo Empresa"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 0 10px rgba(255,255,255,0.3)",
            }}
          />
        </div>
        <h2 style={{ textAlign: "center" }}>Paradas del Conductor</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>🚏 Juan Pérez → Calle 80 #45</li>
          <li>🚏 Ana Gómez → Av. Caracas #120</li>
          <li>🚏 Luis Torres → Cra 30 #15</li>
          <li>🚏 María López → Terminal Norte</li>
        </ul>
      </div>
      <div id="map" style={{ flex: 1 }}></div>
    </div>
  );
}