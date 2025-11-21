import api from './apiService';

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
        estado: doc.status,         // status → estado
        creadoPor: doc.created_by   // created_by → creadoPor
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
        estado: doc.status,         // status → estado
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