import api from './apiService';

export const documentService = {
  // Operaciones CRUD de documentos
  getAllDocuments: () => api.get('/documents').then(res => res.data),
  getDocumentById: (id) => api.get(`/documents/${id}`).then(res => res.data),
  createDocument: (documentData) => api.post('/documents', documentData).then(res => res.data),
  updateDocument: (id, documentData) => api.put(`/documents/${id}`, documentData).then(res => res.data),
  deleteDocument: (id) => api.delete(`/documents/${id}`).then(res => res.data),
  
  getDocumentStats: () => api.get('/documents/stats').then(res => res.data)
  
  // Búsqueda en servidor comentada - solo usamos filtrado en cliente
  // searchDocuments: (filters) => api.get('/documents/search', { params: filters }).then(res => res.data),
};