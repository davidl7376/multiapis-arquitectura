import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import recursos from "./data.json" assert { type: "json" }; // si quieres mantener datos de ejemplo


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

// POST crear recurso
app.post("/recursos", async (req, res) => {
  const { name, type, project } = req.body;
  if (!name || !type || !project) return res.status(400).json({ error: "name, type & project required" });

  try {
    const r = await pool.query(
      "INSERT INTO recursos_schema.recursos(name, type, project) VALUES($1,$2,$3) RETURNING *",
      [name, type, project]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: "insert failed", detail: String(e) });
  }
});

// PUT actualizar recurso
app.put("/recursos/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, project } = req.body;
  try {
    const r = await pool.query(
      `UPDATE recursos_schema.recursos
       SET name=COALESCE($1,name), type=COALESCE($2,type), project=COALESCE($3,project)
       WHERE id=$4 RETURNING *`,
      [name, type, project, id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: "Recurso no encontrado" });
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
