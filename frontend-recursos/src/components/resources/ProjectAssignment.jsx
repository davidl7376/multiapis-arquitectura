import React, { useState } from "react";
import { proyectosService } from "../../services/recursosService";
import "./ProjectAssignment.css";

export default function ProjectAssignment({ resources = [], onAssignmentUpdate }) {
  const [assignment, setAssignment] = useState({
    personalId: "",
    proyecto: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAssign = async () => {
    if (!assignment.personalId || !assignment.proyecto) {
      alert("Selecciona personal y proyecto");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://recursos-api-cloud-gtaqgsf2hbfvgac5.australiaeast-01.azurewebsites.net/recursos/${assignment.personalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          proyecto_asignado: assignment.proyecto  // ✅ CORREGIDO
        })
      });

      if (res.ok) {
        setMessage("✅ Personal asignado correctamente");
        setAssignment({ personalId: "", proyecto: "" });
        
        setTimeout(() => {
          setMessage("");
        }, 5000);
        
        onAssignmentUpdate();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la asignación");
      }
    } catch (error) {
      console.error("Error al asignar:", error);
      setMessage(`❌ Error: ${error.message}`);
      
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const personalDisponible = resources.filter(p => 
    p.estado === "Disponible" || p.proyecto_asignado === "Sin asignación"
  );

  return (
    <div className="project-assignment card">
      <div className="table-header">
        <h3>Asignación a Proyectos</h3>
      </div>

      <div className="assignment-content">
        {message && (
          <div className={`assignment-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="assignment-grid">
          <div className="form-group">
            <label className="form-label">Seleccionar Personal</label>
            <select 
              className="form-control"
              value={assignment.personalId} 
              onChange={(e) => setAssignment({...assignment, personalId: e.target.value})}
              disabled={loading}
            >
              <option value="">Seleccionar personal</option>
              {personalDisponible.map(persona => (
                <option key={persona.id || persona._id} value={persona.id || persona._id}>
                  {persona.nombre_completo} - {persona.rol} ({persona.especializacion || "N/A"})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Asignar a Proyecto</label>
            <select 
              className="form-control"
              value={assignment.proyecto} 
              onChange={(e) => setAssignment({...assignment, proyecto: e.target.value})}
              disabled={loading}
            >
              <option value="">Seleccionar proyecto</option>
              <option value="Proyecto Alpha">Proyecto Alpha</option>
              <option value="Proyecto Beta">Proyecto Beta</option>
              <option value="Proyecto Gamma">Proyecto Gamma</option>
              <option value="Proyecto Delta">Proyecto Delta</option>
              <option value="Sin asignación">Remover asignación</option>
            </select>
          </div>

          <div className="form-group">
            <button 
              className="btn btn-primary assign-btn"
              onClick={handleAssign}
              disabled={loading}
            >
              {loading ? "Asignando..." : "Asignar Proyecto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}