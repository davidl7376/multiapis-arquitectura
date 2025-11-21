import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import DocumentModal from './DocumentModal';
import '../styles/components/DocumentTable.css';

const DocumentTable = ({ onDocumentUpdate }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los documentos');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocument(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este documento?')) {
      try {
        await documentService.deleteDocument(id);
        await loadDocuments(); // Recargar la lista
        if (onDocumentUpdate) {
          onDocumentUpdate();
        }
      } catch (err) {
        setError('Error al eliminar el documento');
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

  if (loading) {
    return (
      <div className="document-table-container card">
        <div className="table-header">
          <h3>Repositorio Documental</h3>
          <p className="table-subtitle">
            Metadatos de documentos - No se almacenan archivos, solo referencias
          </p>
        </div>
        <div className="loading-state">Cargando documentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-table-container card">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="document-table-container card">
        <div className="table-header">
          <h3>Repositorio Documental</h3>
          <p className="table-subtitle">
            Metadatos de documentos - No se almacenan archivos, solo referencias
          </p>
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
                  <td>{doc.fecha}</td>
                  <td className="version">{doc.version}</td>
                  <td>
                    <span className={getStatusClass(doc.estado)}>
                      {doc.estado}
                    </span>
                  </td>
                  <td>{doc.creadoPor}</td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewDocument(doc)}
                    >
                      👁️ Ver
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(doc.id)}
                      style={{ marginLeft: '8px' }}
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
          <p>Mostrando {documents.length} de {documents.length} documentos</p>
        </div>
      </div>

      {showModal && (
        <DocumentModal
          document={selectedDocument}
          onClose={handleCloseModal}
          onUpdate={onDocumentUpdate}
        />
      )}
    </>
  );
};

export default DocumentTable;