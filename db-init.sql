-- Gestion documental (ya la tienes, por si quieres repetir)
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

-- Recursos
CREATE SCHEMA IF NOT EXISTS recursos_schema;

CREATE TABLE IF NOT EXISTS recursos_schema.recursos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    document_id INTEGER,
    FOREIGN KEY (document_id) REFERENCES gestion_schema.documents(id)
);

-- Proyectos
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
