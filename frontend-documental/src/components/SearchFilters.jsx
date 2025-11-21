import React, { useState } from 'react';
import '../styles/components/SearchFilters.css';

const SearchFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    tipo: '',
    proyecto: ''
  });

  const tiposDocumento = [
    'Todos los tipos',
    'Contrato',
    'Acta',
    'Informe',
    'Especificación',
    'Propuesta',
    'Manual',
    'Plano',
    'Memoria de Cálculo',
    'Presupuesto'
  ];

  const proyectos = [
    'Todos los proyectos',
    'Proyecto Alpha',
    'Proyecto Beta', 
    'Proyecto Gamma',
    'Proyecto Delta',
    'sin asignacion'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className="search-filters card">
      <h3 className="filters-title">Filtros de Búsqueda</h3>
      
      <div className="search-group">
        <label className="filter-label">Buscar por nombre o referencia</label>
        <input
          type="text"
          name="search"
          className="form-control search-input"
          placeholder="Buscar documento..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Tipo de Documento</label>
          <select
            name="tipo"
            className="form-control"
            value={filters.tipo}
            onChange={handleChange}
          >
            {tiposDocumento.map((tipo, index) => (
              <option key={index} value={tipo === 'Todos los tipos' ? '' : tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Proyecto</label>
          <select
            name="proyecto"
            className="form-control"
            value={filters.proyecto}
            onChange={handleChange}
          >
            {proyectos.map((proyecto, index) => (
              <option key={index} value={proyecto === 'Todos los proyectos' ? '' : proyecto}>
                {proyecto === 'sin asignacion' ? 'Sin asignación' : proyecto}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;