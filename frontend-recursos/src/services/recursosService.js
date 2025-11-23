// frontend-recursos/src/services/recursosService.js
const RECURSOS_API = "https://recursos-api-cloud-gtaqgsf2hbfvgac5.australiaeast-01.azurewebsites.net";

export const recursosService = {
  getPersonal: () => fetch(`${RECURSOS_API}/recursos`).then(r => r.json()),
  
  crearPersonal: (data) => fetch(`${RECURSOS_API}/recursos`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  // ✅ AGREGAR ESTOS MÉTODOS:
  eliminarPersonal: (id) => fetch(`${RECURSOS_API}/recursos/${id}`, {
    method: 'DELETE'
  }),
  
  asignarPersonal: (personalId, proyecto) => 
    fetch(`${RECURSOS_API}/recursos/${personalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proyecto_asignado: proyecto })
    })
};