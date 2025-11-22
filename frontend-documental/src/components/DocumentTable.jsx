import React from 'react';
import { documentService } from '../services/documentService';
import '../styles/components/DocumentTable.css';

const DocumentTable = ({ documents = [], onDocumentUpdate }) => {
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el documento "${nombre}"?`)) {
      try {
        await documentService.deleteDocument(id);
        
        // Mostrar mensaje de éxito
        alert('✅ Documento eliminado correctamente');
        
        // Recargar la lista
        if (onDocumentUpdate) {
          onDocumentUpdate();
        }
      } catch (err) {
        console.error('Error eliminando documento:', err);
        alert('❌ Error al eliminar el documento');
      }
    }
  };

  const getStatusClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'status-active';
      case 'en revisión':
        return 'status-review';
      case 'archivado':
        return 'status-archived';
      case 'borrador':
        return 'status-borrador';
      default:
        return 'status-active';
    }
  };

  return (
    <div className="document-table-container card">
      <div className="table-header">
        <h3>Repositorio Documental</h3>
        {/* TEXTO ELIMINADO */}
      </div>

      <div className="table-responsive">
        <table className="document-table">
          <thead>
            <tr>
              <th>Nombre del Documento</th>
              <th>Tipo</th>
              <th>Proyecto</th>
              <th>Fecha</th>
              <th>Versión</th>
              <th>Estado</th>
              <th>Creado Por</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={doc.id || index}>
                <td className="document-name">{doc.nombre}</td>
                <td>{doc.tipo}</td>
                <td>{doc.proyecto || 'Sin asignación'}</td>
                <td>{doc.fecha || 'No especificada'}</td>
                <td className="version">{doc.version || 'v1.0'}</td>
                <td>
                  <span className={getStatusClass(doc.estado)}>
                    {doc.estado}
                  </span>
                </td>
                <td>{doc.creadoPor || 'No especificado'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(doc.id, doc.nombre)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>Mostrando {documents.length} documentos</p>
      </div>
    </div>
  );
};

export default DocumentTable;