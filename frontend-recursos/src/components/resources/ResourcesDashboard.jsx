import "./ResourcesDashboard.css";

export default function ResourcesDashboard({ resources = [] }) {
  const stats = {
    personalTotal: resources.length,
    personalDisponible: resources.filter(res => res.estado === 'Disponible').length,
    equiposTotal: 0, // Puedes ajustar esto según tu lógica
    equiposDisponibles: 0 // Puedes ajustar esto según tu lógica
  };

  return (
    <div className="resources-dashboard">
      <h3>Dashboard de Recursos</h3>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <p>Personal Total</p>
          <h2>{stats.personalTotal}</h2>
        </div>
        <div className="dashboard-card">
          <p>Personal Disponible</p>
          <h2>{stats.personalDisponible}</h2>
        </div>
        <div className="dashboard-card">
          <p>Equipos Total</p>
          <h2>{stats.equiposTotal}</h2>
        </div>
        <div className="dashboard-card">
          <p>Equipos Disponibles</p>
          <h2>{stats.equiposDisponibles}</h2>
        </div>
      </div>
    </div>
  );
}