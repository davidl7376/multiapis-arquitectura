Proyecto “multiapis-arquitectura2” — Arquitectura con microservicios y múltiples frontends

Este proyecto contiene varias APIs independientes y dos frontends, organizados como microservicios dentro de un mismo repositorio.
El objetivo es mantener servicios separados por dominio (documentos, recursos, proyectos) y frontends específicos para cada módulo.

El entorno está preparado para ejecutarse mediante Docker Compose, permitiendo levantar todas las APIs, base de datos(s) y frontends desde un solo archivo orquestador.

##📁 1) Estructura del repositorio

```
multiapis-arquitectura2/
├─ .github/                  # Workflows de GitHub Actions (CI/CD)
│
├─ frontend-documental/     # Frontend para módulo de gestión documental
├─ frontend-recursos/       # Frontend para módulo de recursos
│
├─ gestion-documental-api/  # API de gestión documental (microservicio)
├─ proyectos-api/           # API para administración de proyectos
├─ recursos-api/            # API para gestión de recursos (humanos o materiales)
│
├─ .env                     # Variables globales utilizadas por Docker o servicios
├─ .gitignore
│
├─ db-init.sql              # Script inicial para la base de datos
│
├─ docker-compose.yml       # Orquestador de contenedores del proyecto
│
└─ README.md                # Documentación del proyecto (este archivo)

```

## ⚙️ 2) recursos API (Node.js + Express)

### `recursos-api/package.json`
```json
{
  "name": "recursos-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "pg": "^8.16.3"
  }
}
```

### `recursos-api/src/data.json`
```json
[
  {
    "id": 1,
    "nombre": "Carlos Pérez",
    "tipo": "personal",
    "rol": "Bodeguero",
    "estado": "disponible",
    "asignadoA": "Ninguno"
  },
  {
    "id": 2,
    "nombre": "Montacargas Toyota 3T",
    "tipo": "equipo",
    "estado": "mantenimiento",
    "asignadoA": "Área de carga"
  }
]

```

### `recursos-api/src/app.js`
```js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4002;
const SERVICE = process.env.SERVICE_NAME || "recursos-api";

// Health
app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));

// Health DB
app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// GET todos los recursos
app.get("/recursos", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM recursos_schema.recursos ORDER BY id ASC");
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// GET recurso por id
app.get("/recursos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("SELECT * FROM recursos_schema.recursos WHERE id=$1", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// POST crear recurso - VERSIÓN CORREGIDA
app.post("/recursos", async (req, res) => {
  const { 
    nombre_completo, 
    rol, 
    especializacion, 
    email, 
    telefono, 
    estado, 
    proyecto_asignado 
  } = req.body;

  // Validación de campos requeridos
  if (!nombre_completo || !rol || !email) {
    return res.status(400).json({ 
      error: "nombre_completo, rol y email son requeridos" 
    });
  }

  try {
    const r = await pool.query(
      `INSERT INTO recursos_schema.recursos 
       (nombre_completo, rol, especializacion, email, telefono, estado, proyecto_asignado) 
       VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre_completo, rol, especializacion, email, telefono, estado, proyecto_asignado]
    );
    
    console.log('✅ Recurso creado:', r.rows[0]);
    res.status(201).json(r.rows[0]);
    
  } catch (e) {
    console.error('❌ Error creando recurso:', e);
    res.status(500).json({ 
      error: "insert failed", 
      detail: String(e) 
    });
  }
});

// PUT actualizar recurso - VERSIÓN CORREGIDA
app.put("/recursos/:id", async (req, res) => {
  const { id } = req.params;
  const { 
    nombre_completo, rol, especializacion, email, 
    telefono, estado, proyecto_asignado 
  } = req.body;
  
  try {
    const r = await pool.query(
      `UPDATE recursos_schema.recursos
       SET nombre_completo=COALESCE($1, nombre_completo),
           rol=COALESCE($2, rol),
           especializacion=COALESCE($3, especializacion),
           email=COALESCE($4, email),
           telefono=COALESCE($5, telefono),
           estado=COALESCE($6, estado),
           proyecto_asignado=COALESCE($7, proyecto_asignado)
       WHERE id=$8 RETURNING *`,
      [nombre_completo, rol, especializacion, email, telefono, estado, proyecto_asignado, id]
    );
    
    if (r.rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "update failed", detail: String(e) });
  }
});

// DELETE recurso
app.delete("/recursos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("DELETE FROM recursos_schema.recursos WHERE id=$1 RETURNING id", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ deletedId: r.rows[0].id });
  } catch (e) {
    res.status(500).json({ error: "delete failed", detail: String(e) });
  }
});

app.listen(PORT, () => console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`));
```

### `recursos-api/Dockerfile`
```dockerfile
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 4002
ENV PORT=4002 SERVICE_NAME=recursos-api
CMD ["node", "src/app.js"]

```

### `recursos-api/.dockerignore`
```
node_modules
npm-debug.log
```

---

## ⚙️ 3) Recursos API (Node.js + Express)

### `proyectos-api/package.json`
```json
{
  "name": "proyectos-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "pg": "^8.16.3"
  }
}
```

### `proyectos-api/src/data.json`
```json
[
  {
    "id": 1,
    "nombre": "Implementación de Sección de Papelería",
    "codigo": "PRJ-001",
    "tipo": "comercial",
    "fechaInicio": "2025-01-15",
    "fechaFin": "2025-03-30",
    "responsable": "Laura Gómez",
    "avance": "40%",
    "hitos": [
      "Compra de estanterías",
      "Inventario inicial"
    ]
  },
  {
    "id": 2,
    "nombre": "Optimización de Inventario",
    "codigo": "PRJ-002",
    "tipo": "logística",
    "fechaInicio": "2025-02-01",
    "fechaFin": "2025-04-10",
    "responsable": "Miguel Torres",
    "avance": "20%",
    "hitos": [
      "Auditoría inicial"
    ]
  }
]
```

### `proyectos-api/src/app.js`
```js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import proyectos from "./data.json" assert { type: "json" }; // opcional


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4003;
const SERVICE = process.env.SERVICE_NAME || "proyectos-api";

// Health
app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));

// Health DB
app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});



// GET todos los proyectos
app.get("/proyectos", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM proyectos_schema.proyectos ORDER BY id ASC");
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// GET proyecto por id
app.get("/proyectos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("SELECT * FROM proyectos_schema.proyectos WHERE id=$1", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// POST crear proyecto
app.post("/proyectos", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  try {
    const r = await pool.query(
      "INSERT INTO proyectos_schema.proyectos(name, description) VALUES($1,$2) RETURNING *",
      [name, description || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "insert failed", detail: String(e) });
  }
});

// PUT actualizar proyecto
app.put("/proyectos/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const r = await pool.query(
      `UPDATE proyectos_schema.proyectos
       SET name=COALESCE($1,name), description=COALESCE($2,description)
       WHERE id=$3 RETURNING *`,
      [name, description, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "update failed", detail: String(e) });
  }
});

// DELETE proyecto
app.delete("/proyectos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("DELETE FROM proyectos_schema.proyectos WHERE id=$1 RETURNING id", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ deletedId: r.rows[0].id });
  } catch (e) {
    res.status(500).json({ error: "delete failed", detail: String(e) });
  }
});

app.listen(PORT, () => console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`));

```

### `proyectos-api/Dockerfile`
```dockerfile
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 4003
ENV PORT=4003 SERVICE_NAME=proyectos-api
CMD ["node", "src/app.js"]

```

### `proyectos-api/.dockerignore`
```
node_modules
npm-debug.log

```

---


## ⚙️ 4) gestion-documental API (Node.js + Express)

### `gestion-documental/package.json`
```json
{
  "name": "gestion-documental-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "pg": "^8.16.3"
  }
}

```

### `products-api/src/data.json`
```json
[
  {
    "id": 1,
    "nombre": "Contrato de Suministro",
    "tipo": "contrato",
    "proyecto": "Mejora de Inventario 2025",
    "fecha": "2025-01-10",
    "version": "1.0",
    "estado": "aprobado",
    "creadoPor": "Admin"
  },
  {
    "id": 2,
    "nombre": "Acta de Revisión",
    "tipo": "acta",
    "proyecto": "Sistema de Bodega",
    "fecha": "2025-02-01",
    "version": "1.2",
    "estado": "pendiente",
    "creadoPor": "Supervisor"
  }
]
```

### `products-api/src/app.js`
```js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

// ✅ CONFIGURACIÓN CORS CORREGIDA - AGREGAR TU URL
app.use(cors({
  origin: [
    'https://lively-pond-046373900.3.azurestaticapps.net',
    'https://agreeable-mud-0a2b6d400.3.azurestaticapps.net',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// ✅ AGREGAR ESTA LÍNEA PARA PREFLIGHT
app.options('*', cors());

const PORT = process.env.PORT || 4002;

// Health DB
app.get("/db/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Mantén /health general
app.get("/health", (_req, res) => res.json({ status: "ok", service: "gestion-documental-api" }));

// Endpoint raíz para evitar "Cannot GET /"
app.get("/", (_req, res) => {
  res.json({ 
    message: "API de Gestión Documental funcionando", 
    endpoints: {
      documents: "/documents",
      stats: "/documents/stats",
      health: "/health"
    }
  });
});

// Crear documento
app.post("/documents", async (req, res) => {
  const { name, type, project, version, status, created_by } = req.body ?? {};
  if (!name || !type || !project) return res.status(400).json({ error: "name, type & project required" });

  try {
    const r = await pool.query(
      `INSERT INTO gestion_schema.documents(name, type, project, version, status, created_by)
       VALUES($1, $2, $3, $4, $5, $6)
       RETURNING id, name, type, project, version, status, created_by`,
      [name, type, project, version || null, status || "Borrador", created_by || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "insert failed", detail: String(e) });
  }
});

// ✅ CORREGIDO: ORDEN DE RUTAS - ESPECÍFICAS PRIMERO

// 1. Estadísticas PRIMERO (antes de /documents/:id)
app.get("/documents/stats", async (_req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) FROM gestion_schema.documents");
    const active = await pool.query("SELECT COUNT(*) FROM gestion_schema.documents WHERE status='Activo'");
    const review = await pool.query("SELECT COUNT(*) FROM gestion_schema.documents WHERE status='En Revisión'");
    const draft = await pool.query("SELECT COUNT(*) FROM gestion_schema.documents WHERE status='Borrador'");
    const archived = await pool.query("SELECT COUNT(*) FROM gestion_schema.documents WHERE status='Archivado'");
    
    // Contar proyectos únicos (excluyendo 'sin asignacion')
    const projectsResult = await pool.query(
      "SELECT COUNT(DISTINCT project) FROM gestion_schema.documents WHERE project != 'sin asignacion'"
    );
    
    res.json({
      total: parseInt(total.rows[0].count),
      active: parseInt(active.rows[0].count), 
      review: parseInt(review.rows[0].count),
      draft: parseInt(draft.rows[0].count),
      archived: parseInt(archived.rows[0].count),
      projects: parseInt(projectsResult.rows[0].count) || 0
    });
  } catch (e) {
    res.status(500).json({ error: "stats query failed", detail: String(e) });
  }
});

// 2. Búsqueda SEGUNDO (antes de /documents/:id)
app.get("/documents/search", async (req, res) => {
  const { search, type, project } = req.query;
  
  let query = "SELECT * FROM gestion_schema.documents WHERE 1=1";
  const params = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    query += ` AND (name ILIKE $${paramCount} OR created_by ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }
  
  if (type) {
    paramCount++;
    query += ` AND type = $${paramCount}`;
    params.push(type);
  }
  
  if (project) {
    paramCount++;
    query += ` AND project = $${paramCount}`;
    params.push(project);
  }

  query += " ORDER BY id ASC";

  try {
    const r = await pool.query(query, params);
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: "search failed", detail: String(e) });
  }
});

// 3. Listar documentos GENERAL
app.get("/documents", async (_req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, name, type, project, version, status, created_by FROM gestion_schema.documents ORDER BY id ASC"
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// 4. Rutas con parámetros ÚLTIMAS
app.get("/documents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query(
      "SELECT id, name, type, project, version, status, created_by FROM gestion_schema.documents WHERE id=$1",
      [id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Document not found" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "query failed", detail: String(e) });
  }
});

// PUT actualizar documento
app.put("/documents/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, project, version, status, created_by } = req.body ?? {};
  try {
    const r = await pool.query(
      `UPDATE gestion_schema.documents
       SET name=COALESCE($1,name), type=COALESCE($2,type), project=COALESCE($3,project),
           version=COALESCE($4,version), status=COALESCE($5,status), created_by=COALESCE($6,created_by)
       WHERE id=$7 RETURNING *`,
      [name, type, project, version, status, created_by, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Document not found" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "update failed", detail: String(e) });
  }
});

// DELETE documento
app.delete("/documents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query("DELETE FROM gestion_schema.documents WHERE id=$1 RETURNING id", [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: "Document not found" });
    res.json({ deletedId: r.rows[0].id });
  } catch (e) {
    res.status(500).json({ error: "delete failed", detail: String(e) });
  }
});

// Inicia el servidor
app.listen(PORT, () => console.log(`✅ gestion-documental-api on port ${PORT}`));
```

### `products-api/Dockerfile`
```dockerfile
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 4001
ENV PORT=4001 SERVICE_NAME=gestion-documental-api
CMD ["node", "src/app.js"]

```

### `products-api/.dockerignore`
```
node_modules
npm-debug.log
```

---
## 🧱 5) Docker Compose (red y servicios)

### `docker-compose.yml`
```yaml
version: "3.9"

services:
  postgres:
    image: postgres:15
    container_name: postgres-db
    environment:
      POSTGRES_DB: multiapisdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db-init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  gestion-documental-api:
    build: ./gestion-documental-api
    container_name: gestion-documental-api
    environment:
      - PORT=4001
      - SERVICE_NAME=gestion-documental-api
      - PROYECTOS_API_URL=http://proyectos-api:4003
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4001:4001"
    depends_on:
      - postgres
    restart: unless-stopped

  recursos-api:
    build: ./recursos-api
    container_name: recursos-api
    environment:
      - PORT=4002
      - SERVICE_NAME=recursos-api
      - GESTION_API_URL=http://gestion-documental-api:4001
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4002:4002"
    depends_on:
      - postgres
      - gestion-documental-api
    restart: unless-stopped

  proyectos-api:
    build: ./proyectos-api
    container_name: proyectos-api
    environment:
      - PORT=4003
      - SERVICE_NAME=proyectos-api
      - GESTION_API_URL=http://gestion-documental-api:4001
      - RECURSOS_API_URL=http://recursos-api:4002
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4003:4003"
    depends_on:
      - postgres
      - gestion-documental-api
      - recursos-api
    restart: unless-stopped

volumes:
  postgres_data:
```

## 🔎 6) Endpoints para probar (Postman/Insomnia)

### recursos API (http://localhost:4002)
- `GET /health` → estado del servicio
- `GET /db/health` → estado de conexión a la base de datos
- `GET /recursos` → lista completa de recursos (desde PostgreSQL)
- `GET /recursos/:id` → obtiene un recurso por ID
- `POST /recursos` → crea un recurso nuevo.
- `PUT /recursos/:id` → actualiza un recurso existente (actualiza solo los campos enviados)
- `DELETE /recursos/:id` → elimina un recurso por ID

### Proyectos API (http://localhost:4003)
-`GET /health` → estado del servicio
-`GET /db/health` → estado de conexión a la base de datos
-`GET /proyectos` → lista completa de proyectos (desde PostgreSQL)
-`GET /proyectos/:id` → obtiene un proyecto por ID
-`POST /proyectos` → crea un proyecto nuevo
-`PUT /proyectos/:id` → actualiza un proyecto existente (actualiza solo los campos enviados)
-`DELETE /proyectos/:id` → elimina un proyecto por ID

### Gestion Documental API (http://localhost:4001)
-`GET /health` → estado del servicio
-`GET /db/health` → estado de conexión a la base de datos
-`GET /` → mensaje base y rutas disponibles
-`POST /documents` → crea un documento
-`GET /documents/stats` → estadísticas de documentos
-`GET /documents/search` → búsqueda filtrada (search, type, project)
-`GET /documents` → lista completa de documentos
-`GET /documents/:id` → obtiene un documento por ID
-`PUT /documents/:id` → actualiza un documento existente
-`DELETE /documents/:id` → elimina un documento por ID



---

# 🅰️ Etapa A — **APIs en local** + **BD administrada en Azure**

## 🗄️ A1) Crear **PostgreSQL Flexible Server** (Portal de Azure)

1. Entra a **portal.azure.com** → busca **Azure Database for PostgreSQL Flexible Server** → **Create**.  
2. **Basics**:
   - **Resource Group**: `rg-multiapis-arquitectura` (o crea uno nuevo).
   - **Server name**: `pg-multiapis-arquitectura-demo` (único).
   - **Region**: misma que usarás para las APIs.
   - **Workload type** / **Compute + storage**: *Burstable* (B1ms) para clase.
   - **Authentication method**: *Password* → define **admin user** y **password** (guárdalos).
3. **Networking**:
   - Para clase: **Public access**.
   - Agrega **tu IP pública** en el **firewall** (para que tu PC se conecte).
   - Mantén **SSL requerido** (por defecto).
4. **Review + Create** → **Create**.

> ℹ️ **Usuario** en Flexible Server: normalmente usas **`<admin>`** (sin `@server`).  
> Si encuentras errores de auth, prueba la forma **`<admin>@<server>`** (usada en Single Server). **En la tarjeta del servidor** se ve el formato admitido.

---

## 🗃️ A2) Crear **base de datos lógica** y tabla de ejemplo

1. Una vez desplegado, crea la base `multiapisdb`:
   ```bash
   # En Azure Cloud Shell o tu terminal con Azure CLI
   az postgres flexible-server db create \
     --resource-group rg-multiapis \
     --server-name pg-multiapis-demo \
     --database-name multiapisdb
   ```

2. (Crea la tabla `recursos` para pruebas iniciales (puedes usar Query Editor del portal o `psql` o con VSCode):
   ```sql
    DROP TABLE IF EXISTS recursos_schema.recursos CASCADE;

CREATE TABLE IF NOT EXISTS recursos_schema.recursos (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    rol VARCHAR(100) NOT NULL,
    especializacion VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'Disponible',
    proyecto_asignado VARCHAR(255) DEFAULT 'Sin asignación',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO recursos_schema.recursos 
(nombre_completo, rol, especializacion, email, telefono, estado, proyecto_asignado) 
VALUES 
('Juan Pérez García', 'Ingeniero Civil', 'Estructuras', 'juan.perez@empresa.com', '+52 555 1234-5678', 'Disponible', 'Sin asignación'),
('Ana Rodríguez Silva', 'Arquitecta', 'Diseño Arquitectónico', 'ana.rodriguez@empresa.com', '+52 555 9876-5432', 'Proyecto Asignado', 'Torre Norte'),
('Carlos Mendoza López', 'Supervisor', 'Instalaciones', 'carlos.mendoza@empresa.com', '+52 555 4567-8901', 'Disponible', 'Sin asignación');

SELECT * FROM recursos_schema.recursos;

UPDATE recursos_schema.recursos 
SET proyecto_asignado = 'Proyecto Alpha' 
WHERE proyecto_asignado = 'Torre Norte';
    ```

3. (tabla proyectos):

```sql
  CREATE SCHEMA IF NOT EXISTS proyectos_schema;

CREATE TABLE IF NOT EXISTS proyectos_schema.proyectos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    document_id INTEGER,
    recurso_id INTEGER,
    FOREIGN KEY (document_id) REFERENCES gestion_schema.documents(id),
    FOREIGN KEY (recurso_id) REFERENCES recursos_schema.recursos(id)
);
    ```
3. (tabla documents):

```
CREATE SCHEMA IF NOT EXISTS gestion_schema;

CREATE TABLE IF NOT EXISTS gestion_schema.documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    project VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    created_by VARCHAR(255)
);
```




---

## 🔐 A3) Preparar **connection string** (con SSL)

> PostgreSQL en Azure exige TLS. Usa `sslmode=require`.

**Ejemplo (`.env` en la raíz del monorepo — NO commitear):**
```
USERS_DATABASE_URL=postgres://<admin>:<PASSWORD>@pg-multiapis-demo.postgres.database.azure.com:5432/multiapisdb?sslmode=require
```

> Reemplaza `<admin>` y `<PASSWORD>`.  
> Si tu Flexible Server exige el formato con sufijo, usa `<admin>@pg-multiapis-demo` como usuario.

---

## ⚙️ A4) Conectar **Users API** a PostgreSQL

### A4.1 Instala la dependencia
```bash
cd users-api
npm i pg
cd ..
```

### A4.2 Crea `users-api/src/db.js`
```js
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Azure PG exige TLS; para demo deshabilitamos validación de CA
});
```

## 🧱 A5) Docker Compose (inyectando `DATABASE_URL` solo a Users)

**`.env` en la raíz (revisar A3)**  
```
DATABASE_URL=postgres://harvey:David123@pg-multiapis-arquitectura-demo.postgres.database.azure.com:5432/multiapisdb?sslmode=require

```

**`docker-compose.yml`**
```yaml
version: "3.9"

services:
  postgres:
    image: postgres:15
    container_name: postgres-db
    environment:
      POSTGRES_DB: multiapisdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db-init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  gestion-documental-api:
    build: ./gestion-documental-api
    container_name: gestion-documental-api
    environment:
      - PORT=4001
      - SERVICE_NAME=gestion-documental-api
      - PROYECTOS_API_URL=http://proyectos-api:4003
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4001:4001"
    depends_on:
      - postgres
    restart: unless-stopped

  recursos-api:
    build: ./recursos-api
    container_name: recursos-api
    environment:
      - PORT=4002
      - SERVICE_NAME=recursos-api
      - GESTION_API_URL=http://gestion-documental-api:4001
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4002:4002"
    depends_on:
      - postgres
      - gestion-documental-api
    restart: unless-stopped

  proyectos-api:
    build: ./proyectos-api
    container_name: proyectos-api
    environment:
      - PORT=4003
      - SERVICE_NAME=proyectos-api
      - GESTION_API_URL=http://gestion-documental-api:4001
      - RECURSOS_API_URL=http://recursos-api:4002
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/multiapisdb
    ports:
      - "4003:4003"
    depends_on:
      - postgres
      - gestion-documental-api
      - recursos-api
    restart: unless-stopped

volumes:
  postgres_data:
```


# ☁️ ETAPA B — tre services **en la nube** (App Service for Containers) usando la **misma BD de Azure PostgreSQL**

> Objetivo: desplegar **`recursos-api`** , **`proyectos-api`** y **`gestion-documental-api`** (monorepo) como **Web Apps for Containers**, con imágenes en **ACR**, **CI/CD con GitHub Actions**, y ambas **conectadas a la misma base de datos** de **PostgreSQL Flexible Server** creada en la Etapa A.










---

## 📦 1) Crear (o reutilizar) Azure Container Registry (ACR)

1. Portal → **Container registries** → **Create**.
2. **Resource Group:** `rg-multiapis-arquitectura`  
3. **Registry name:** `acrmultiapis-arquitectura` (único)  
4. **SKU:** `Basic` → **Create**.
5. Tras crear: anota **Login server**: `acrmultiapis<algo>.azurecr.io`.

> Usaremos ACR para **almacenar** las imágenes de `recursos-api` , `proyectos-api` y `gestion-documental-api`.

---

## 🧑‍💻 2) Credenciales para GitHub Actions (Service Principal + Secrets)

### 2.1 Service Principal (Microsoft Entra ID)
1. Portal → **Microsoft Entra ID** → **App registrations** → **New registration**.  
   - **Name:** `spn-github-multi-apis-arquitectura`  
   - **Register**.
2. Guarda: **Application (client) ID** y **Directory (tenant) ID**.
3. **Certificates & secrets** → **New client secret** → copia el **Value**.

### 2.2 Asigna permisos (RBAC)
1. **Resource groups** → `rg-multiapis-arquitectura` → **Access control (IAM)** → **Add role assignment**.  
2. **Role:** `Contributor` → asigna a `spn-github-multi-apis-arquitectura`.

### 2.3 Secrets en GitHub (repo monorepo)
Repo → **Settings → Secrets and variables → Actions**:

| Secret              | Valor                                                                 |
|---------------------|-----------------------------------------------------------------------|
| `AZURE_CREDENTIALS` | JSON con `clientId`, `clientSecret`, `tenantId`, `subscriptionId`     |
| `ACR_LOGIN_SERVER`  | `acrmultiapis-arquitectura.azurecr.io`                                       |
| `ACR_USERNAME`      | (ACR → **Access keys** → Username)                                    |
| `ACR_PASSWORD`      | (ACR → **Access keys** → Password)                                    |

**`AZURE_CREDENTIALS` (ejemplo):**
```json
{
  "clientId": "<APP_CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>",
  "subscriptionId": "<SUBSCRIPTION_ID>",
  "tenantId": "<TENANT_ID>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

> Este SPN sirve para **login** en Azure desde Actions. Para **pull** desde App Service usaremos **Identidad Administrada** (más abajo).

---

## 🤖 3) Workflows en el monorepo (build & push a ACR)

Crea **`.github/workflows/deploy.yml`**:
```yaml
name: Build & Push all APIs to ACR

on:
  push:
    branches: [ "main" ]
    paths:
      - "gestion-documental-api/**"
      - "proyectos-api/**"
      - "recursos-api/**"
      - ".github/workflows/deploy.yml"
  workflow_dispatch:

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        include:
          - service: gestion-documental-api
            context: gestion-documental-api
            dockerfile: gestion-documental-api/Dockerfile
            image: gestion-documental-api
          - service: proyectos-api
            context: proyectos-api
            dockerfile: proyectos-api/Dockerfile
            image: proyectos-api
          - service: recursos-api
            context: recursos-api
            dockerfile: recursos-api/Dockerfile
            image: recursos-api

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔧 Debug Secrets
        run: |
          echo "ACR_LOGIN_SERVER length: ${#ACR_LOGIN_SERVER}"
          echo "ACR_USERNAME length: ${#ACR_USERNAME}"
          echo "ACR_PASSWORD length: ${#ACR_PASSWORD}"
        env:
          ACR_LOGIN_SERVER: ${{ secrets.ACR_LOGIN_SERVER }}
          ACR_USERNAME: ${{ secrets.ACR_USERNAME }}
          ACR_PASSWORD: ${{ secrets.ACR_PASSWORD }}

      - name: 🔐 Azure Login (Service Principal)
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: 🔑 Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: 🏷️ Set version tag (short sha)
        id: vars
        run: echo "TAG=${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

      - name: 🏗️ Build & Push ${{ matrix.service }}
        run: |
          # Verificar que ACR_LOGIN_SERVER tiene valor
          if [ -z "${{ secrets.ACR_LOGIN_SERVER }}" ]; then
            echo "ERROR: ACR_LOGIN_SERVER está vacío"
            exit 1
          fi
          
          FULL_IMAGE_NAME="${{ secrets.ACR_LOGIN_SERVER }}/${{ matrix.image }}"
          echo "Building image: $FULL_IMAGE_NAME"
          
          # Construir la imagen
          docker build \
            -t $FULL_IMAGE_NAME:latest \
            -f ${{ matrix.dockerfile }} \
            ${{ matrix.context }}
          
          # Tag con SHA
          docker tag \
            $FULL_IMAGE_NAME:latest \
            $FULL_IMAGE_NAME:${{ steps.vars.outputs.TAG }}
          
          # Push ambas tags
          docker push $FULL_IMAGE_NAME:latest
          docker push $FULL_IMAGE_NAME:${{ steps.vars.outputs.TAG }}
          
          echo "✅ Build and push completed for ${{ matrix.service }}"
```



Crea **`.github/workflows/azure-static-web-apps-agreeable-mud-0a2b6d400.yml`**:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    permissions:
       id-token: write
       contents: read
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false
      - name: Install OIDC Client from Core Package
        run: npm install @actions/core@1.6.0 @actions/http-client
      - name: Get Id Token
        uses: actions/github-script@v6
        id: idtoken
        with:
           script: |
               const coredemo = require('@actions/core')
               return await coredemo.getIDToken()
           result-encoding: string
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_MUD_0A2B6D400 }}
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "/frontend-recursos" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "build" # 🆕 CAMBIO CRÍTICO: Built app content directory
          github_id_token: ${{ steps.idtoken.outputs.result }}
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          action: "close"
```


Crea **`.github/workflows/azure-static-web-apps-lively-pond-046373900.yml`**:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    permissions:
       id-token: write
       contents: read
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false
      - name: Install OIDC Client from Core Package
        run: npm install @actions/core@1.6.0 @actions/http-client
      - name: Get Id Token
        uses: actions/github-script@v6
        id: idtoken
        with:
           script: |
               const coredemo = require('@actions/core')
               return await coredemo.getIDToken()
           result-encoding: string
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_LIVELY_POND_046373900 }}
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "./frontend-documental" # App source code path
          api_location: "" # Api source code path - optional
          output_location: "build" # Built app content directory - optional
          github_id_token: ${{ steps.idtoken.outputs.result }}
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          action: "close"

```


## 🧱 4) App Service Plan (Linux) y tre **Web Apps for Containers**

### 4.1 Web App `recursos-api-cloud` (Container)
1. **Create Web App**:
   - **Name:** `recursos-api-cloud`
   - **Publish:** **Container**
   - **OS:** Linux
   - **Region:** misma que ACR
2. **Docker (tab)**:
   - **Image source:** Azure Container Registry
   - **Registry:** `acrmultiapis-arquitectura`
   - **Authentication:** Credenciales de Admin
   - **Image:** `recursos-api`
   - **Tag:** `latest`
3. **Create**.

**Configurar App Settings (imprescindible)**  
`users-api-cloud` → **Configuration → Variables de entorno**:
- `WEBSITES_PORT = 4002`
- `NODE_ENV = production` (opcional)
- `DATABASE_URL = postgres://harvey:David123@pg-multiapis-arquitectura-demo.postgres.database.azure.com:5432/multiapisdb?sslmode=require`

**Autenticación para *pull* desde ACR (recomendado: Identidad Administrada)**
- `recursos-api-cloud` → **Identity → System assigned = On** → **Save**.  
- ACR → **Access control (IAM) → Add role assignment** → **Role:** `AcrPull` → asigna la **identidad** de `recursos-api-cloud`.  
- `recursos-api-cloud` → **Deployment Center → Contenedores → Editar contenedor**:  
  - **Autenticación:** *Identidad administrada* → **Guardar**.

**Webhook (auto-actualizar `latest`)**
- `recursos-api-cloud` → **Deployment Center → Contenedores**:
  - Confirma **`recursos-api:latest`**
  - Activa **Implementación continua para el contenedor principal** → crea **webhook** en ACR.

### 4.2 Web App `proyectos-api-cloud` (Container)
Repite el proceso cambiando:
- **Name:** `proyectos-api-cloud`
- **Image:** `proyectos-api:latest`

**App Settings**
- `WEBSITES_PORT = 4003`
- `NODE_ENV = production` (opcional)
- `RECURSOS_API_URL = https://recursos-api-cloud.azurewebsites.net`
- *(Si products también conecta a BD)*:  
  `DATABASE_URL = postgres://harvey:David123@pg-multiapis-arquitectura-demo.postgres.database.azure.com:5432/multiapisdb sslmode=require`

**Autenticación & Webhook**: igual que `recursos-api-cloud`.


### 4.3 Web App `gestion-documental-api-cloud` (Container)
Repite el proceso cambiando:
- **Name:** `gestion-documental-api-cloud`
- **Image:** `gestion-documental-api:latest`

**App Settings**
- `WEBSITES_PORT = 4001`
- `NODE_ENV = production` (opcional)
- `RECURSOS_API_URL = https://recursos-api-cloud.azurewebsites.net`
- *(Si products también conecta a BD)*:  
  `DATABASE_URL = postgres://harvey:David123@pg-multiapis-arquitectura-demo.postgres.database.azure.com:5432/multiapisdb sslmode=require`

**Autenticación & Webhook**: igual que `recursos-api-cloud`.

---
