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

  const fetchResources = async () => {
    try {
      const data = await recursosService.getPersonal();
      setResources(data);
    } catch (err) {
      console.error("Error cargando recursos:", err);
    }
  };

  useEffect(() => { 
    fetchResources(); 
  }, []);

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Gestión de Recursos</h1>
        <p className="resources-subtitle">
          Control de personal y equipos con asignación a proyectos
        </p>
      </div>

      <ResourcesForm onSuccess={fetchResources} />
      
      <ProjectAssignment resources={resources} onAssignmentUpdate={fetchResources} />
      <ProjectResourcesView resources={resources} />
      
      <ResourcesDashboard resources={resources} />
      <ResourcesFilters />
      <ResourcesTable resources={resources} />
    </div>
  );
}