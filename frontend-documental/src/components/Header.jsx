import React from 'react';
import '../styles/components/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <h1 className="app-title">Arqui</h1>
          <p className="app-subtitle">
            Gestión Documental - Repositorio centralizado de metadatos documentales para cumplimiento normativo y trazabilidad
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;