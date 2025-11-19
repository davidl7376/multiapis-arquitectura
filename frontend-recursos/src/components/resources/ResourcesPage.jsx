import React, { useEffect, useState } from "react";
import ResourcesDashboard from "./ResourcesDashboard";
import ResourcesFilters from "./ResourcesFilters";
import ResourcesTable from "./ResourcesTable";
import ResourcesForm from "./ResourcesForm";
import ProjectAssignment from "./ProjectAssignment"; // ← Nuevo
import ProjectResourcesView from "./ProjectResourcesView"; // ← Nuevo
import "./ResourcesPage.css";

export default function ResourcesPage() {
  const API_BASE = "http://localhost:4000/api/personal";
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error(err);
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
      
      {/* NUEVOS COMPONENTES DE ASIGNACIÓN */}
      <ProjectAssignment resources={resources} onAssignmentUpdate={fetchResources} />
      <ProjectResourcesView resources={resources} />
      
      <ResourcesDashboard resources={resources} />
      <ResourcesFilters />
      <ResourcesTable resources={resources} />
    </div>
  );
}