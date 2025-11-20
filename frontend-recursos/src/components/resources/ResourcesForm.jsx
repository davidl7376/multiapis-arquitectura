import React, { useState } from "react";
import { recursosService } from "../../services/recursosService";
import "./ResourcesForm.css";

export default function ResourceForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",                    // 🆕 Cambiado de nombreCompleto
    type: "",                    // 🆕 Cambiado de rol
    especializacion: "",
    email: "",
    telefono: "",
    estado: "Disponible",        // 🆕 Valor por defecto
    project: "Sin asignación"    // 🆕 Cambiado de proyectoAsignado
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.type || !form.email) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 🆕 Usar el servicio real en lugar de fetch directo
      await recursosService.crearPersonal(form);
      
      // Limpiar formulario
      setForm({
        name: "",
        type: "",
        especializacion: "",
        email: "",
        telefono: "",
        estado: "Disponible",
        project: "Sin asignación"
      });
      
      setMessage("✅ Personal registrado exitosamente");
      
      // 🆕 Notificar al componente padre para actualizar la tabla
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error al registrar personal:", error);
      setMessage("❌ Error al registrar personal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-form-card">
      <h3>Registrar Nuevo Personal</h3>
      <p className="form-description">Complete la información del personal para agregarlo al sistema</p>
      
      {message && (
        <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <form className="resource-form-body" onSubmit={handleSubmit}>
        <div className="form-row two-cols">
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              name="name"  // 🆕 Cambiado
              placeholder="Ej: Juan Pérez García"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rol *</label>
            <select name="type" value={form.type} onChange={handleChange} required>  {/* 🆕 Cambiado */}
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
        </div>

        <div className="form-row">
          <label>Especialización</label>
          <input
            name="especializacion"
            placeholder="Ej: Estructuras, Instalaciones, etc."
            value={form.especializacion}
            onChange={handleChange}
          />
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              placeholder="correo@caleda.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="telefono"
              placeholder="+52 555 1234-5678"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              <option value="Disponible">Disponible</option>  {/* 🆕 Valor por defecto */}
              <option>Asignado</option>
              <option>En Mantenimiento</option>
              <option>Vacaciones</option>
            </select>
          </div>

          <div className="form-group">
            <label>Proyecto Asignado</label>
            <select name="project" value={form.project} onChange={handleChange}>  {/* 🆕 Cambiado */}
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
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Personal"}
          </button>
        </div>
      </form>
    </div>
  );
}