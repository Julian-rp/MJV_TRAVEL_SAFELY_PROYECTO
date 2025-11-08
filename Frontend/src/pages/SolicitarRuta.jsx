import React, { useState } from "react";
import "../styles/SolicitarRuta.css";


export default function SolicitarRuta() {
  const [empresa, setEmpresa] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [horaLlegada, setHoraLlegada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [nombreFuncionario, setNombreFuncionario] = useState("");

  // ✅ Función para agregar empleados
  const agregarEmpleado = () => {
    if (!nombreFuncionario.trim()) {
      alert("Por favor escribe un nombre.");
      return;
    }

    const direccionEmpleado = prompt("Ingrese dirección del empleado:");
    if (!direccionEmpleado) {
      alert("Por favor ingrese una dirección válida.");
      return;
    }

    setEmpleados([...empleados, { nombre: nombreFuncionario, direccion: direccionEmpleado }]);
    setNombreFuncionario("");
  };

  // ✅ Manejo de envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!empresa || !direccion || !telefono || !cantidad || !horaLlegada || !horaSalida) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (empleados.length === 0) {
      alert("Debe agregar al menos un funcionario.");
      return;
    }

    alert("Formulario enviado correctamente ✅");

    // Resetear
    setEmpresa("");
    setDireccion("");
    setTelefono("");
    setCantidad("");
    setHoraLlegada("");
    setHoraSalida("");
    setEmpleados([]);
  };

  return (
    <>
      <nav>
        <div className="logo">
          <img src="../img/Logo.png" alt="Logo MJ" />
          <span className="brand-name">travel safely</span>
        </div>
        <ul>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/solicitar">Solicitar Ruta</a></li>
        
        </ul>
      </nav>

      <div className="form-container">
        <img src="../img/mjv.jpeg" alt="MJY Travel Logo" />
        <h2>SOLICITUD DE RUTA</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre de Empresa*</label>
          <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />

          <label>Dirección de Empresa*</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

          <label>Teléfono de Empresa*</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

          <label>Cantidad de Empleados a Solicitar Ruta*</label>
          <select value={cantidad} onChange={(e) => setCantidad(e.target.value)} required>
            <option value="">Seleccione</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <label>Busca Funcionario*</label>
          <div className="form-row">
            <input
              type="text"
              placeholder="Ej: Santiago"
              value={nombreFuncionario}
              onChange={(e) => setNombreFuncionario(e.target.value)}
            />
            <button type="button" className="btn-agregar" onClick={agregarEmpleado}>Agregar</button>
          </div>

          <table className="tabla-empleados">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp, i) => (
                <tr key={i}>
                  <td>{emp.nombre}</td>
                  <td>{emp.direccion}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <label>Hora de solicitud de llegada*</label>
          <input type="time" value={horaLlegada} onChange={(e) => setHoraLlegada(e.target.value)} required />

          <label>Hora de solicitud de salida*</label>
          <input type="time" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} required />

          <button type="submit" className="btn-enviar">SOLICITAR</button>
        </form>
      </div>
    </>
  );
}