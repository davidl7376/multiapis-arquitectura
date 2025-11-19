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
    <div className="resources-filters">
      <div className="filters-header">
        <h4>Personal</h4>
        <p>Ingenieros, técnicos, supervisores y más</p>
      </div>
      
      <div className="filter-row">
        <div className="filter-group">
          <label>Buscar por nombre o rol</label>
          <input 
            name="search"
            placeholder="Buscar personal..." 
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>Estado</label>
          <select name="estado" value={filters.estado} onChange={handleChange}>
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