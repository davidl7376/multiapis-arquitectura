// frontend-recursos/src/services/recursosService.js
const RECURSOS_API = "https://recursos-api-cloud.azurewebsites.net";
const PROYECTOS_API = "https://proyectos-api-cloud.azurewebsites.net";

export const recursosService = {
  getPersonal: () => fetch(`${RECURSOS_API}/recursos`).then(r => r.json()),
  crearPersonal: (data) => fetch(`${RECURSOS_API}/recursos`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};

export const proyectosService = {
  getProyectos: () => fetch(`${PROYECTOS_API}/proyectos`).then(r => r.json()),
  asignarPersonal: (personalId, proyectoId) => 
    fetch(`${RECURSOS_API}/recursos/${personalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: proyectoId })
    })
};