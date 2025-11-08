import React, { useState, useEffect } from "react";
import "../styles/FormularioModal.css";
import { genericService } from "../services/api";
import { validateDateRange, isValidDate, validatePhone } from "../utils/validation";

export default function FormularioModal({
  isOpen,
  onClose,
  tipo,
  item = null,
  onSave,
}) {
  const [formData, setFormData] = useState({});

  const getDefaultFormData = (tipo) => {
    switch (tipo) {
      case "usuarios":
        return {
          Tip_usuario: "Empleado",
          Nom_completo: "",
          direccion: "",
          Correo: "",
          Telefono: "",
          contrasena: "",
          Id_empresa: 1,
        };
      case "ruta":
        return {
          Placas: "",
          Hora_Salida: new Date().toISOString().slice(0, 16),
          Hora_Entrada: new Date().toISOString().slice(0, 16),
          Id_usuario: "",
        };
      case "empresa":
        return {
          Tip_empresa: "",
          Nom_empresa: "",
          Direccion: "",
          Correo: "",
        };
      default:
        return {};
    }
  };

  const getRequiredFields = (tipo) => {
    switch (tipo) {
      case "usuarios":
        return [
          "Nom_completo",
          "Correo",
          "Telefono",
          "direccion",
          "contrasena",
        ];
      case "ruta":
        return ["Placas", "Hora_Salida", "Hora_Entrada", "Id_usuario"];
      case "empresa":
        return ["Tip_empresa", "Nom_empresa"];
      default:
        return [];
    }
  };

  // Inicializar formData con valores por defecto
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
      } else {
        setFormData(getDefaultFormData(tipo));
      }
    }
  }, [isOpen, item, tipo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    const requiredFields = getRequiredFields(tipo);
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Por favor complete los campos: ${missingFields.join(", ")}`);
      return;
    }

    // Validaciones específicas por tipo
    if (tipo === "usuarios") {
      if (formData.Telefono && !validatePhone(formData.Telefono)) {
        alert("El teléfono debe ser un número válido");
        return;
      }
      if (formData.Correo && !formData.Correo.includes("@")) {
        alert("El correo debe tener un formato válido");
        return;
      }
    }

    if (tipo === "ruta") {
      if (formData.Id_usuario && isNaN(parseInt(formData.Id_usuario))) {
        alert("El ID de usuario debe ser un número válido");
        return;
      }

      // Validar fechas
      if (formData.Hora_Salida && !isValidDate(formData.Hora_Salida)) {
        alert("La hora de salida no es una fecha válida");
        return;
      }
      if (formData.Hora_Entrada && !isValidDate(formData.Hora_Entrada)) {
        alert("La hora de entrada no es una fecha válida");
        return;
      }

      // Validar que la hora de entrada sea posterior a la de salida
      if (
        !validateDateRange(formData.Hora_Salida, formData.Hora_Entrada)
      ) {
        alert("La hora de entrada debe ser posterior a la hora de salida");
        return;
      }
    }

    try {
      // Limpiar datos antes de enviar (remover campos de relación)
      const cleanData = { ...formData };
      delete cleanData.empresa;
      delete cleanData.usuario;
      delete cleanData.asesor_ruta;
      delete cleanData.ruta_servicio;
      delete cleanData.patrocinador;

      // Asegurar que las fechas estén en formato ISO para Prisma
      if (tipo === "ruta") {
        if (cleanData.Hora_Salida) {
          cleanData.Hora_Salida = new Date(cleanData.Hora_Salida).toISOString();
        }
        if (cleanData.Hora_Entrada) {
          cleanData.Hora_Entrada = new Date(
            cleanData.Hora_Entrada
          ).toISOString();
        }
      }

      let result;
      if (item) {
        // Actualizar
        const idField =
          tipo === "usuarios"
            ? "id_usuario"
            : tipo === "ruta"
            ? "Id_ruta"
            : "id_empresa";
        result = await genericService.update(tipo, item[idField], cleanData);
      } else {
        // Crear
        result = await genericService.create(tipo, cleanData);
      }

      // Verificar si la operación fue exitosa
      if (result.exito === true || (result.exito !== false && !result.mensaje)) {
        alert(
          item
            ? "Elemento actualizado correctamente"
            : "Elemento creado correctamente"
        );
        onSave();
        onClose();
      } else {
        // Mostrar error específico del backend
        alert("Error: " + (result.mensaje || "Error desconocido"));
        console.error("Error del backend:", result);
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      if (err.message && err.message.includes("HTTP error")) {
        alert(
          "Error de conexión con el servidor. Verifique que el backend esté ejecutándose."
        );
      } else {
        alert("Error al guardar el elemento: " + err.message);
      }
    }
  };

  if (!isOpen) return null;

  const getFormFields = () => {
    switch (tipo) {
      case "usuarios":
        return (
          <>
            <div className="form-group">
              <label>Tipo de Usuario:</label>
              <select
                name="Tip_usuario"
                value={formData.Tip_usuario}
                onChange={handleInputChange}
              >
                <option value="Empleado">Empleado</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                name="Nom_completo"
                value={formData.Nom_completo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="Correo"
                value={formData.Correo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        );
      case "ruta":
        return (
          <>
            <div className="form-group">
              <label>Placas:</label>
              <input
                type="text"
                name="Placas"
                value={formData.Placas}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Salida:</label>
              <input
                type="datetime-local"
                name="Hora_Salida"
                value={formData.Hora_Salida}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Entrada:</label>
              <input
                type="datetime-local"
                name="Hora_Entrada"
                value={formData.Hora_Entrada}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ID Usuario:</label>
              <input
                type="number"
                name="Id_usuario"
                value={formData.Id_usuario}
                onChange={handleInputChange}
                required
                placeholder="Ej: 1"
              />
              <small>Ingrese el ID de un usuario existente</small>
            </div>
          </>
        );
      case "empresa":
        return (
          <>
            <div className="form-group">
              <label>Tipo de Empresa:</label>
              <input
                type="text"
                name="Tip_empresa"
                value={formData.Tip_empresa}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nombre de Empresa:</label>
              <input
                type="text"
                name="Nom_empresa"
                value={formData.Nom_empresa}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                name="Direccion"
                value={formData.Direccion}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="Correo"
                value={formData.Correo}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? `Editar ${tipo}` : `Crear ${tipo}`}</h2>
          <button onClick={onClose} className="btn-cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {getFormFields()}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {item ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
