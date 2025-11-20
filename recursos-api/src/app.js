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