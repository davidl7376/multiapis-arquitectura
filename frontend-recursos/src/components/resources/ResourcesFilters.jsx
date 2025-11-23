import { useState } from "react";
import "./ResourcesFilters.css";

export default function ResourcesFilters() {
  const [filters, setFilters] = useState({
    search: "",
    estado: ""
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="resources-filters card">
      <div className="filters-header">
        <h3>Filtros de Búsqueda</h3>
        <p>Buscar personal por nombre, rol o estado</p>
      </div>
      
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Buscar por nombre o rol</label>
          <input 
            name="search"
            className="filter-control"
            placeholder="Buscar personal..." 
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <select 
            name="estado" 
            className="filter-control"
            value={filters.estado} 
            onChange={handleChange}
          >
            <option value="">Todos los estados</option>
            <option>Asignado</option>
            <option>Disponible</option>
            <option>En Mantenimiento</option>
            <option>Vacaciones</option>
          </select>
        </div>
      </div>
    </div>
  );
}