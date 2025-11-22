import React from 'react';
import "./ResourcesDashboard.css";

export default function ResourcesDashboard({ resources = [] }) {
  // Calcular estadísticas basadas en los recursos
  const stats = {
    personalTotal: resources.length,
    personalDisponible: resources.filter(res => 
      res.estado?.includes('Disponible') || res.estado === 'D' || res.estado === 'Disponible'
    ).length,
    personalAsignado: resources.filter(res => 
      res.estado?.includes('Asignado') || res.estado === 'A' || res.estado === 'Asignado'
    ).length,
    proyectosActivos: [...new Set(resources.map(r => r.proyectoAsignado).filter(p => p && p !== 'Sin asignación'))].length
  };

  const statsData = [
    { 
      label: 'Personal Total', 
      value: stats.personalTotal.toString(), 
      color: 'stat-total' 
    },
    { 
      label: 'Disponible', 
      value: stats.personalDisponible.toString(), 
      color: 'stat-disponible' 
    },
    { 
      label: 'Asignado', 
      value: stats.personalAsignado.toString(), 
      color: 'stat-asignado' 
    },
    { 
      label: 'Proyectos Activos', 
      value: stats.proyectosActivos.toString(), 
      color: 'stat-proyectos' 
    }
  ];

  return (
    <div className="resources-dashboard">
      <div className="container">
        <h2 className="stats-title">Dashboard de Recursos</h2>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className={`stat-item ${stat.color}`}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}