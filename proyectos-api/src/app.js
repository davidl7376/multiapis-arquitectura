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
