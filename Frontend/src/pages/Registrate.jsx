import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Registrate.css";
import { authService } from "../services/api";
import { validateEmail, validatePasswordLength } from "../utils/validation";
import RegistroModal from "../components/RegistroModal";

export default function Registrate() {
  const [mostrarModal, setMostrarModal] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="registrate-page">
      <nav className="registrate-nav">
        <div className="registrate-logo">
          <img src="/img/Logo.png" alt="Logo MJ" />
          <span className="registrate-brand-name">travel safely</span>
        </div>
        <ul className="registrate-menu">
          <li>
            <Link to="/" className="registrate-link">
              Inicio
            </Link>
          </li>
        </ul>
      </nav>

      <RegistroModal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          navigate("/");
        }}
        onSuccess={() => {
          setTimeout(() => {
            setMostrarModal(false);
            navigate("/iniciarsesion");
          }, 2000);
        }}
      />
    </div>
  );
}
