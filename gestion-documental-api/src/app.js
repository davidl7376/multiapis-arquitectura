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