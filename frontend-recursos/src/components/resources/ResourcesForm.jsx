import React, { useState } from "react";
import { recursosService } from "../../services/recursosService";
import "./ResourcesForm.css";

export default function ResourceForm({ onSuccess }) {
  const [form, setForm] = useState({
    nombre_completo: "",
    rol: "",
    especializacion: "",
    email: "",
    telefono: "",
    estado: "Disponible",
    proyecto_asignado: "Sin asignación"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre_completo || !form.rol || !form.email) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await recursosService.crearPersonal(form);
      
      // Limpiar formulario
      setForm({
        nombre_completo: "",
        rol: "",
        especializacion: "",
        email: "",
        telefono: "",
        estado: "Disponible",
        proyecto_asignado: "Sin asignación"
      });
      
      setMessage("✅ Personal registrado exitosamente");
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error al registrar personal:", error);
      setMessage("❌ Error al registrar personal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-form card">
      <h3 className="form-title">Registrar Nuevo Personal</h3>
      <p className="form-subtitle">
        Complete la información del personal para agregarlo al sistema
      </p>

      {message && (
        <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Fila 1: Nombre Completo + Rol */}
          <div className="form-group">
            <label className="form-label">Nombre Completo *</label>
            <input
              type="text"
              name="nombre_completo"
              className="form-control"
              placeholder="Ej: Juan Pérez García"
              value={form.nombre_completo}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol *</label>
            <select
              name="rol"
              className="form-control"
              value={form.rol}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Seleccionar rol</option>
              <option>Ingeniero Civil</option>
              <option>Técnico Eléctrico</option>
              <option>Supervisor</option>
              <option>Ingeniero Mecánico</option>
              <option>Técnico de Mantenimiento</option>
              <option>Ingeniero Industrial</option>
              <option>Supervisor de Obra</option>
            </select>
          </div>

          {/* Fila 2: Especialización (ancho completo) */}
          <div className="form-group full-width">
            <label className="form-label">Especialización</label>
            <input
              type="text"
              name="especializacion"
              className="form-control"
              placeholder="Ej: Estructuras, Instalaciones, etc."
              value={form.especializacion}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Fila 3: Email + Teléfono */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="correo@empresa.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="+52 555 1234-5678"
              value={form.telefono}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Fila 4: Estado + Proyecto Asignado */}
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              className="form-control"
              value={form.estado}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Disponible">Disponible</option>
              <option>Asignado</option>
              <option>En Mantenimiento</option>
              <option>Vacaciones</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Proyecto Asignado</label>
            <select
              name="proyecto_asignado"
              className="form-control"
              value={form.proyecto_asignado}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Sin asignación</option>
              <option>Proyecto Alpha</option>
              <option>Proyecto Beta</option>
              <option>Proyecto Gamma</option>
              <option>Proyecto Delta</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Personal"}
          </button>
        </div>
      </form>
    </div>
  );
}