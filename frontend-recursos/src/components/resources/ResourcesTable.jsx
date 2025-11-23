import { useState, useEffect } from "react";
import { recursosService } from "../../services/recursosService";
import "./ResourcesTable.css";

export default function ResourcesTable({ resources = [], onResourceUpdate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPersonal = async () => {
    try {
      setLoading(true);
      const personalData = await recursosService.getPersonal();
      setError(null);
    } catch (err) {
      setError("Error cargando el personal");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a "${nombre}"?`)) {
      try {
        // Necesitamos agregar el método eliminarPersonal al servicio
        await fetch(`https://recursos-api-cloud-gtaqgsf2hbfvgac5.australiaeast-01.azurewebsites.net/recursos/${id}`, {
          method: 'DELETE'
        });
        
        alert('✅ Personal eliminado correctamente');
        
        // Recargar la lista
        if (onResourceUpdate) {
          onResourceUpdate();
        }
      } catch (err) {
        console.error('Error eliminando personal:', err);
        alert('❌ Error al eliminar el personal');
      }
    }
  };

  useEffect(() => {
    loadPersonal();
  }, []);

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

  if (loading) {
    return (
      <div className="resources-table-container card">
        <div className="table-header">
          <h3>Recursos de Personal</h3>
        </div>
        <div className="loading">Cargando personal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resources-table-container card">
        <div className="table-header">
          <h3>Recursos de Personal</h3>
        </div>
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
    <div className="resources-table-container card">
      <div className="table-header">
        <h3>Recursos de Personal</h3>
      </div>

      <div className="table-responsive">
        <table className="resources-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Especialización</th>
              <th>Estado</th>
              <th>Proyecto Asignado</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resources.length > 0 ? resources.map((resource, index) => (
              <tr key={resource.id || resource._id || index}>
                <td className="nombre-cell">{resource.nombre_completo}</td>
                <td>{resource.rol}</td>
                <td>{resource.especializacion || "N/A"}</td>
                <td>
                  <span className={getStatusClass(resource.estado)}>
                    {resource.estado || "Disponible"}
                  </span>
                </td>
                <td>{resource.proyecto_asignado || "Sin asignación"}</td>
                <td className="contacto-cell">
                  <div>{resource.email || "N/A"}</div>
                  <div className="telefono">{resource.telefono || "N/A"}</div>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(resource.id || resource._id, resource.nombre_completo)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No hay personal registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>Mostrando {resources.length} recursos de personal</p>
      </div>
    </div>
  );
}