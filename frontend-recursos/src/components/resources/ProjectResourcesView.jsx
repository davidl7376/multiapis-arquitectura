import React, { useState } from "react";
import "./ProjectResourcesView.css";

export default function ProjectResourcesView({ resources }) {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");

  const proyectos = [
    "Proyecto Alpha",
    "Proyecto Beta", 
    "Proyecto Gamma",
    "Proyecto Delta",
    "Sin asignación"
  ];

  const recursosPorProyecto = proyectoSeleccionado 
    ? resources.filter(p => p.proyectoAsignado === proyectoSeleccionado)
    : [];

  const statsPorProyecto = proyectos.map(proyecto => ({
    nombre: proyecto,
    count: resources.filter(p => p.proyectoAsignado === proyecto).length,
    recursos: resources.filter(p => p.proyectoAsignado === proyecto)
  }));

  return (
    <div className="project-resources-view">
      <h3>Vista de Recursos por Proyecto</h3>
      
      <div className="project-selector">
        <label>Seleccionar Proyecto:</label>
        <select 
          value={proyectoSeleccionado} 
          onChange={(e) => setProyectoSeleccionado(e.target.value)}
        >
          <option value="">Todos los proyectos</option>
          {proyectos.map(proyecto => (
            <option key={proyecto} value={proyecto}>
              {proyecto} ({statsPorProyecto.find(p => p.nombre === proyecto)?.count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Estadísticas rápidas */}
      <div className="project-stats">
        {statsPorProyecto.map(proyecto => (
          <div key={proyecto.nombre} className="project-stat-card">
            <h4>{proyecto.nombre}</h4>
            <div className="stat-number">{proyecto.count}</div>
            <div className="stat-label">recursos asignados</div>
          </div>
        ))}
      </div>

      {/* Vista detallada del proyecto seleccionado */}
      {proyectoSeleccionado && (
        <div className="project-detail">
          <h4>Recursos en {proyectoSeleccionado}</h4>
          {recursosPorProyecto.length > 0 ? (
            <div className="resources-list">
              {recursosPorProyecto.map(recurso => (
                <div key={recurso.id} className="resource-item">
                  <div className="resource-info">
                    <strong>{recurso.nombreCompleto}</strong>
                    <span>{recurso.rol}</span>
                    <span className="especializacion">{recurso.especializacion}</span>
                  </div>
                  <div className="resource-contact">
                    <div>{recurso.email}</div>
                    <div>{recurso.telefono}</div>
                  </div>
                  <div className={`resource-status status-${recurso.estado?.charAt(0)}`}>
                    {recurso.estado}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-resources">No hay recursos asignados a este proyecto</p>
          )}
        </div>
      )}
    </div>
  );
}