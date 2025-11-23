import React, { useState } from "react";
import "./ProjectResourcesView.css";

export default function ProjectResourcesView({ resources = [] }) {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState("");

  const proyectos = [
    "Proyecto Alpha",
    "Proyecto Beta", 
    "Proyecto Gamma",
    "Proyecto Delta",
    "Sin asignación"
  ];

  const recursosPorProyecto = proyectoSeleccionado 
    ? resources.filter(p => p.proyecto_asignado === proyectoSeleccionado)
    : [];

  const statsPorProyecto = proyectos.map(proyecto => ({
    nombre: proyecto,
    count: resources.filter(p => p.proyecto_asignado === proyecto).length,
    recursos: resources.filter(p => p.proyecto_asignado === proyecto)
  }));

  const getStatusClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':
        return 'status-disponible';
      case 'asignado':
        return 'status-asignado';
      case 'en mantenimiento':
        return 'status-mantenimiento';
      case 'vacaciones':
        return 'status-vacaciones';
      default:
        return 'status-disponible';
    }
  };

  return (
    <div className="project-resources-view card">
      <div className="table-header">
        <h3>Vista de Recursos por Proyecto</h3>
      </div>

      <div className="project-content">
        <div className="project-selector">
          <label className="selector-label">Seleccionar Proyecto:</label>
          <select 
            className="selector-control"
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

        {/* Estadísticas rápidas - Mismo diseño que el dashboard */}
        <div className="project-stats-grid">
          {statsPorProyecto.map(proyecto => (
            <div key={proyecto.nombre} className={`project-stat-card ${proyecto.count > 0 ? 'has-resources' : 'no-resources'}`}>
              <div className="stat-value">{proyecto.count}</div>
              <div className="stat-label">{proyecto.nombre}</div>
              <div className="stat-subtitle">recursos asignados</div>
            </div>
          ))}
        </div>

        {/* Vista detallada del proyecto seleccionado */}
        {proyectoSeleccionado && (
          <div className="project-detail">
            <h4 className="detail-title">Recursos en {proyectoSeleccionado}</h4>
            {recursosPorProyecto.length > 0 ? (
              <div className="resources-table-container">
                <table className="resources-detail-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Especialización</th>
                      <th>Contacto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recursosPorProyecto.map(recurso => (
                      <tr key={recurso.id || recurso._id}>
                        <td className="nombre-cell">{recurso.nombre_completo}</td>
                        <td>{recurso.rol}</td>
                        <td>{recurso.especializacion || "N/A"}</td>
                        <td className="contacto-cell">
                          <div>{recurso.email || "N/A"}</div>
                          <div className="telefono">{recurso.telefono || "N/A"}</div>
                        </td>
                        <td>
                          <span className={getStatusClass(recurso.estado)}>
                            {recurso.estado || "Disponible"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-resources-message">
                <p>No hay recursos asignados a este proyecto</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}