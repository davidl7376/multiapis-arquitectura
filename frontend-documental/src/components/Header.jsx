import React from 'react';
import '../styles/components/Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">IngeSmart</h1>
        <p className="app-subtitle">
          Gestión Documental
        </p>
      </div>
    </header>
  );
};

export default Header;