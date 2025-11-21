import React from 'react';
import '../styles/components/DocumentModal.css';

const DocumentModal = ({ document, onClose, onUpdate }) => {
  if (!document) return null;

  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{document.nombre}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="document-details">
            <div className="detail-row">
              <label>Tipo de Documento:</label>
              <span>{document.tipo}</span>
            </div>
            <div className="detail-row">
              <label>Proyecto:</label>
              <span>{document.proyecto}</span>
            </div>
            <div className="detail-row">
              <label>Fecha de Creación:</label>
              <span>{document.fecha}</span>
            </div>
            <div className="detail-row">
              <label>Versión:</label>
              <span className="version">{document.version}</span>
            </div>
            <div className="detail-row">
              <label>Estado:</label>
              <span className={getStatusClass(document.estado)}>
                {document.estado}
              </span>
            </div>
            <div className="detail-row">
              <label>Creado Por:</label>
              <span>{document.creadoPor}</span>
            </div>
          </div>

          <div className="document-description">
            <h4>Descripción</h4>
            <p>
              Documento de {document.tipo.toLowerCase()} para el proyecto {document.proyecto}. 
              Actualmente se encuentra en estado {document.estado.toLowerCase()}.
            </p>
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Cerrar
            </button>
            <button className="btn btn-outline">
              📥 Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;