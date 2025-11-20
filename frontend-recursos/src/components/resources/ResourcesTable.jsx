import { useState, useEffect } from "react";
import { recursosService } from "../../services/recursosService";
import "./ResourcesTable.css";

export default function ResourcesTable() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPersonal = async () => {
    try {
      setLoading(true);
      const personalData = await recursosService.getPersonal();
      setResources(personalData);
      setError(null);
    } catch (err) {
      setError("Error cargando el personal");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonal();
  }, []);

  const getEstadoBadge = (estado) => {
    const badges = {
      'Asignado': 'A',
      'Disponible': 'D', 
      'En Mantenimiento': 'M',
      'Vacaciones': 'V'
    };
    return badges[estado] || estado;
  };

  if (loading) {
    return (
      <div className="resources-table-card">
        <h3>Recursos de Personal</h3>
        <div className="loading">Cargando personal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-table-card">
        <h3>Recursos de Personal</h3>
        <div className="error">
          {error}
          <button onClick={loadPersonal} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-table-card">
      <h3>Recursos de Personal ({resources.length})</h3>

      <table className="resources-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Especialización</th>
            <th>Estado</th>
            <th>Proyecto Asignado</th>
            <th>Contacto</th>
          </tr>
        </thead>
        <tbody>
          {resources.length > 0 ? resources.map((resource, index) => (
            <tr key={resource.id || resource._id || index}>
              {/* ✅ CAMPOS CORREGIDOS */}
              <td className="nombre-cell">{resource.nombre_completo}</td>
              <td>{resource.rol}</td>
              <td>{resource.especializacion || "N/A"}</td>
              <td>
                <span className={`estado-badge estado-${getEstadoBadge(resource.estado)}`}>
                  ({getEstadoBadge(resource.estado)}) {resource.estado || "Disponible"}
                </span>
              </td>
              <td>{resource.proyecto_asignado || "Sin asignar"}</td>
              <td className="contacto-cell">
                <div>{resource.email || "N/A"}</div>
                <div className="telefono">{resource.telefono || "N/A"}</div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="no-data">
                No hay personal registrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}