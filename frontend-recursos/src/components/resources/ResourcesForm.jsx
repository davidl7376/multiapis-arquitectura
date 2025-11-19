import React, { useState } from "react";
import "./ResourcesForm.css";

export default function ResourceForm({ onSuccess }) {
  const API_BASE = "http://localhost:4000/api/personal";

  const [form, setForm] = useState({
    nombreCompleto: "",
    rol: "",
    especializacion: "",
    email: "",
    telefono: "",
    estado: "",
    proyectoAsignado: "Sin asignación"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombreCompleto || !form.rol || !form.email) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setForm({
          nombreCompleto: "",
          rol: "",
          especializacion: "",
          email: "",
          telefono: "",
          estado: "",
          proyectoAsignado: "Sin asignación"
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error al registrar personal:", error);
    }
  };

  return (
    <div className="resource-form-card">
      <h3>Registrar Nuevo Personal</h3>
      <p className="form-description">Complete la información del personal para agregarlo al sistema</p>
      
      <form className="resource-form-body" onSubmit={handleSubmit}>
        <div className="form-row two-cols">
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              name="nombreCompleto"
              placeholder="Ej: Juan Pérez García"
              value={form.nombreCompleto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rol *</label>
            <select name="rol" value={form.rol} onChange={handleChange} required>
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
              <option value="">Seleccionar estado</option>
              <option>Asignado</option>
              <option>Disponible</option>
              <option>En Mantenimiento</option>
              <option>Vacaciones</option>
            </select>
          </div>

          <div className="form-group">
            <label>Proyecto Asignado</label>
            <select name="proyectoAsignado" value={form.proyectoAsignado} onChange={handleChange}>
              <option>Sin asignación</option>
              <option>Proyecto Alpha</option>
              <option>Proyecto Beta</option>
              <option>Proyecto Gamma</option>
              <option>Proyecto Delta</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Registrar Personal
          </button>
        </div>
      </form>
    </div>
  );
}