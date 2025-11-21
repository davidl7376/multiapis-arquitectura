import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import '../styles/components/DocumentStats.css';

const DocumentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await documentService.getDocumentStats();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Error al cargar estadísticas');
      // Datos por defecto en caso de error
      setStats({
        total: 145,
        active: 145,
        review: 23,
        projects: 8
      });
    } finally {
      setLoading(false);
    }
  };

  // Configuración de las estadísticas para mapear con tus clases CSS
  const getStatsData = () => {
    if (!stats) return [];
    
    return [
      { 
        label: 'Activos', 
        value: stats.active?.toString() || '0', 
        color: 'stat-active' 
      },
      { 
        label: 'En Revisión', 
        value: stats.review?.toString() || '0', 
        color: 'stat-review' 
      },
      { 
        label: 'Proyectos', 
        value: stats.projects?.toString() || '0', 
        color: 'stat-projects' 
      }
    ];
  };

  const statsData = getStatsData();

  if (loading) {
    return (
      <div className="document-stats">
        <div className="container">
          <h2 className="stats-title">Total Documentos</h2>
          <div className="stats-grid">
            {['stat-active', 'stat-review', 'stat-projects'].map((color, index) => (
              <div key={index} className={`stat-item ${color} loading`}>
                <div className="stat-value">--</div>
                <div className="stat-label">
                  {color === 'stat-active' && 'Activos'}
                  {color === 'stat-review' && 'En Revisión'}
                  {color === 'stat-projects' && 'Proyectos'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="document-stats">
      <div className="container">
        <h2 className="stats-title">Total Documentos</h2>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className={`stat-item ${stat.color}`}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        {error && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--spacing-md)',
            color: 'var(--error-color)',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentStats;