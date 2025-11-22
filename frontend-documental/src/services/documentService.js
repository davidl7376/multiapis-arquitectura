import api from './apiService';

// ✅ FUNCIÓN PARA TRANSFORMAR ESTADOS
const transformarEstado = (estadoIngles) => {
  const estados = {
    'draft': 'Borrador',
    'active': 'Activo', 
    'review': 'En Revisión',
    'archived': 'Archivado',
    'Borrador': 'Borrador',
    'Activo': 'Activo',
    'En Revisión': 'En Revisión',
    'Archivado': 'Archivado'
  };
  return estados[estadoIngles] || estadoIngles;
};

export const documentService = {
  // Operaciones CRUD de documentos
  getAllDocuments: () => 
    api.get('/documents').then(res => 
      res.data.map(doc => ({
        id: doc.id,
        nombre: doc.name,           // name → nombre
        tipo: doc.type,             // type → tipo
        proyecto: doc.project,      // project → proyecto
        version: doc.version,
        estado: transformarEstado(doc.status),  // ← TRANSFORMAR ESTADO
        creadoPor: doc.created_by,  // created_by → creadoPor
        fecha: doc.fecha || new Date().toISOString().split('T')[0] // Agregar fecha si falta
      }))
    ),
  
  getDocumentById: (id) => 
    api.get(`/documents/${id}`).then(res => {
      const doc = res.data;
      return {
        id: doc.id,
        nombre: doc.name,           // name → nombre
        tipo: doc.type,             // type → tipo
        proyecto: doc.project,      // project → proyecto
        version: doc.version,
        estado: transformarEstado(doc.status),  // ← TRANSFORMAR ESTADO
        creadoPor: doc.created_by   // created_by → creadoPor
      };
    }),
  
  createDocument: (documentData) => {
    // Transformar los campos del frontend al formato que espera la API
    const apiData = {
      name: documentData.nombre,
      type: documentData.tipo,
      project: documentData.proyecto,
      version: documentData.version,
      status: documentData.estado,
      created_by: documentData.creadoPor
    };
    
    return api.post('/documents', apiData).then(res => res.data);
  },
  
  updateDocument: (id, documentData) => {
    // Transformar los campos del frontend al formato que espera la API
    const apiData = {
      name: documentData.nombre,
      type: documentData.tipo,
      project: documentData.proyecto,
      version: documentData.version,
      status: documentData.estado,
      created_by: documentData.creadoPor
    };
    
    return api.put(`/documents/${id}`, apiData).then(res => res.data);
  },
  
  deleteDocument: (id) => api.delete(`/documents/${id}`).then(res => res.data),
  
  getDocumentStats: () => api.get('/documents/stats').then(res => res.data),
  
  // Búsqueda en servidor comentada - solo usamos filtrado en cliente
  // searchDocuments: (filters) => api.get('/documents/search', { params: filters }).then(res => res.data),
};