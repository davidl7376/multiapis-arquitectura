import "./ResourcesTable.css";

export default function ResourcesTable({ resources = [] }) {
  const getEstadoBadge = (estado) => {
    const badges = {
      'Asignado': 'A',
      'Disponible': 'D', 
      'En Mantenimiento': 'M',
      'Vacaciones': 'V'
    };
    return badges[estado] || estado;
  };

  return (
    <div className="resources-table-card">
      <h3>Recursos de Personal</h3>

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
              <td className="nombre-cell">{resource.nombreCompleto}</td>
              <td>{resource.rol}</td>
              <td>{resource.especializacion}</td>
              <td>
                <span className={`estado-badge estado-${getEstadoBadge(resource.estado)}`}>
                  ({getEstadoBadge(resource.estado)}) {resource.estado}
                </span>
              </td>
              <td>{resource.proyectoAsignado}</td>
              <td className="contacto-cell">
                <div>{resource.email}</div>
                <div className="telefono">{resource.telefono}</div>
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