import React, { useEffect, useState } from "react";
import ResourcesDashboard from "./ResourcesDashboard";
import ResourcesFilters from "./ResourcesFilters";
import ResourcesTable from "./ResourcesTable";
import ResourcesForm from "./ResourcesForm";
import ProjectAssignment from "./ProjectAssignment";
import ProjectResourcesView from "./ProjectResourcesView";
import { recursosService } from "../../services/recursosService";
import "./ResourcesPage.css";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    estado: ""
  });

  const fetchResources = async () => {
    try {
      const data = await recursosService.getPersonal();
      setResources(data);
      setFilteredResources(data); // Inicializar recursos filtrados
    } catch (err) {
      console.error("Error cargando recursos:", err);
    }
  };

  // Aplicar filtros cuando cambien los filtros o los recursos
  useEffect(() => {
    let filtered = resources;
    
    // Filtro por búsqueda (nombre o rol)
    if (filters.search) {
      filtered = filtered.filter(resource => 
        resource.nombre_completo?.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.rol?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Filtro por estado
    if (filters.estado) {
      filtered = filtered.filter(resource => 
        resource.estado === filters.estado
      );
    }
    
    setFilteredResources(filtered);
  }, [filters, resources]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => { 
    fetchResources(); 
  }, []);

  return (
    <div className="resources-page">
      <header className="resources-header">
        <div className="header-content">
          <h1 className="app-title">IngeSmart</h1>
          <p className="app-subtitle">Gestión de Recursos</p>
          <p className="header-description">
            Control de personal y equipos con asignación a proyectos
          </p>
        </div>
      </header>

      <ResourcesForm onSuccess={fetchResources} />
      
      <ProjectAssignment resources={resources} onAssignmentUpdate={fetchResources} />
      <ProjectResourcesView resources={resources} />
      
      <ResourcesDashboard resources={resources} />
      
      {/* FILTROS CONECTADOS */}
      <ResourcesFilters onFilterChange={handleFilterChange} />
      
      {/* TABLA CON RECURSOS FILTRADOS */}
      <ResourcesTable resources={filteredResources} onResourceUpdate={fetchResources} />
    </div>
  );
}