import React, { useState } from "react";
import "./ProjectAssignment.css";

export default function ProjectAssignment({ resources, onAssignmentUpdate }) {
  const [assignment, setAssignment] = useState({
    personalId: "",
    proyecto: ""
  });

  const handleAssign = async () => {
    if (!assignment.personalId || !assignment.proyecto) {
      alert("Selecciona personal y proyecto");
      return;
    }

    try {
      // Aquí va tu API call para actualizar la asignación
      const res = await fetch(`http://localhost:4000/api/personal/${assignment.personalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proyectoAsignado: assignment.proyecto })
      });

      if (res.ok) {
        alert("Personal asignado correctamente");
        setAssignment({ personalId: "", proyecto: "" });
        onAssignmentUpdate();
      }
    } catch (error) {
      console.error("Error al asignar:", error);
    }
  };

  const personalDisponible = resources.filter(p => 
    p.estado === "Disponible" || p.proyectoAsignado === "Sin asignación"
  );

  return (
    <div className="project-assignment-card">
      <h3>Asignación a Proyectos</h3>
      
      <div className="assignment-form">
        <div className="form-group">
          <label>Seleccionar Personal</label>
          <select 
            value={assignment.personalId} 
            onChange={(e) => setAssignment({...assignment, personalId: e.target.value})}
          >
            <option value="">Seleccionar personal</option>
            {personalDisponible.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombreCompleto} - {persona.rol} ({persona.especializacion})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Asignar a Proyecto</label>
          <select 
            value={assignment.proyecto} 
            onChange={(e) => setAssignment({...assignment, proyecto: e.target.value})}
          >
            <option value="">Seleccionar proyecto</option>
            <option value="Proyecto Alpha">Proyecto Alpha</option>
            <option value="Proyecto Beta">Proyecto Beta</option>
            <option value="Proyecto Gamma">Proyecto Gamma</option>
            <option value="Proyecto Delta">Proyecto Delta</option>
            <option value="Sin asignación">Remover asignación</option>
          </select>
        </div>

        <button className="btn-assign" onClick={handleAssign}>
          Asignar Proyecto
        </button>
      </div>
    </div>
  );
}