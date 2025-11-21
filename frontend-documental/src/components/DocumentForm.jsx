import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import '../styles/components/DocumentForm.css';

const DocumentForm = ({ onDocumentCreated, editDocument }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    proyecto: 'sin asignacion',
    fecha: new Date().toISOString().split('T')[0],
    version: 'v1.0',
    estado: 'Borrador',
    creadoPor: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si estamos editando, cargar los datos del documento
  useEffect(() => {
    if (editDocument) {
      setFormData({
        nombre: editDocument.nombre || '',
        tipo: editDocument.tipo || '',
        proyecto: editDocument.proyecto || 'sin asignacion',
        fecha: editDocument.fecha || new Date().toISOString().split('T')[0],
        version: editDocument.version || 'v1.0',
        estado: editDocument.estado || 'Borrador',
        creadoPor: editDocument.creadoPor || ''
      });
    }
  }, [editDocument]);

  const tiposDocumento = [
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

  // SOLO ESTOS PROYECTOS COMO INDICAS
  const proyectos = [
    'sin asignacion',
    'Proyecto Alpha',
    'Proyecto Beta',
    'Proyecto Gamma',
    'Proyecto Delta'
  ];

  const estados = ['Activo', 'En Revisión', 'Archivado', 'Borrador'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.tipo || !formData.creadoPor) {
      setError('Por favor complete los campos obligatorios (*)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editDocument) {
        await documentService.updateDocument(editDocument.id, formData);
      } else {
        await documentService.createDocument(formData);
      }
      
      // Resetear formulario
      setFormData({
        nombre: '',
        tipo: '',
        proyecto: 'sin asignacion',
        fecha: new Date().toISOString().split('T')[0],
        version: 'v1.0',
        estado: 'Borrador',
        creadoPor: ''
      });

      if (onDocumentCreated) {
        onDocumentCreated();
      }

    } catch (err) {
      console.error('Error saving document:', err);
      setError(editDocument 
        ? 'Error al actualizar el documento' 
        : 'Error al crear el documento'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-form card">
      <h3 className="form-title">Registrar Nuevo Documento</h3>
      <p className="form-subtitle">
        Complete la información del documento para agregarlo al sistema
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* GRID EXACTO COMO EN LA IMAGEN - 2 COLUMNAS */}
        <div className="form-grid">
          {/* Fila 1: Nombre + Tipo */}
          <div className="form-group">
            <label className="form-label">Nombre del Documento *</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej. Contrato Proveedor ABC"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Documento *</label>
            <select
              name="tipo"
              className="form-control"
              value={formData.tipo}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Seleccionar tipo</option>
              {tiposDocumento.map((tipo, index) => (
                <option key={index} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Fila 2: Versión + Estado */}
          <div className="form-group">
            <label className="form-label">Versión</label>
            <input
              type="text"
              name="version"
              className="form-control"
              placeholder="v1.0"
              value={formData.version}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              className="form-control"
              value={formData.estado}
              onChange={handleChange}
              disabled={loading}
            >
              {estados.map((estado, index) => (
                <option key={index} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          {/* Fila 3: Proyecto + Fecha */}
          <div className="form-group">
            <label className="form-label">Proyecto</label>
            <select
              name="proyecto"
              className="form-control"
              value={formData.proyecto}
              onChange={handleChange}
              disabled={loading}
            >
              {proyectos.map((proyecto, index) => (
                <option key={index} value={proyecto}>
                  {proyecto === 'sin asignacion' ? 'Sin asignación' : proyecto}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Fila 4: Creado Por (ancho completo) */}
          <div className="form-group full-width">
            <label className="form-label">Creado Por *</label>
            <input
              type="text"
              name="creadoPor"
              className="form-control"
              placeholder="Ej. Juan Pérez García"
              value={formData.creadoPor}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Registrar Documento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;