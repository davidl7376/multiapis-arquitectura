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




