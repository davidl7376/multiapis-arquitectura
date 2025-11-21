import React, { useState, useEffect } from 'react';
import { documentService } from './services/documentService';
import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import DocumentStats from './components/DocumentStats';
import DocumentForm from './components/DocumentForm';
import DocumentTable from './components/DocumentTable';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    tipo: '',
    proyecto: ''
  });

  // Cargar documentos al iniciar
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado en cliente (tiempo real)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = documents;
    
    if (newFilters.search) {
      filtered = filtered.filter(doc =>
        doc.nombre.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        doc.creadoPor.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    if (newFilters.tipo) {
      filtered = filtered.filter(doc => doc.tipo === newFilters.tipo);
    }
    
    if (newFilters.proyecto) {
      filtered = filtered.filter(doc => doc.proyecto === newFilters.proyecto);
    }
    
    setFilteredDocuments(filtered);
  };

  // Cuando se crea/actualiza un documento
  const handleDocumentCreated = () => {
    loadDocuments();
  };

  // Cuando se actualiza un documento desde el modal
  const handleDocumentUpdate = () => {
    loadDocuments();
  };

  return (
    <div className="App">
      <Header />
      
      {/* LAYOUT VERTICAL - UNA COLUMNA */}
      <div className="vertical-layout">
        
        {/* 1. TOTAL DOCUMENTOS */}
        <section className="layout-section">
          <DocumentStats />
        </section>

        {/* 2. REGISTRAR DOCUMENTO */}
        <section className="layout-section">
          <DocumentForm onDocumentCreated={handleDocumentCreated} />
        </section>

        {/* 3. FILTRO DE BÚSQUEDA */}
        <section className="layout-section">
          <SearchFilters onFilterChange={handleFilterChange} />
        </section>

        {/* 4. REPOSITORIO DOCUMENTAL */}
        <section className="layout-section">
          <DocumentTable 
            documents={filteredDocuments}
            onDocumentUpdate={handleDocumentUpdate}
          />
        </section>
        
      </div>
    </div>
  );
}

export default App;