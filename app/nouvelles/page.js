'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

export default function Nouvelles() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [selectedType, tickets, searchTerm]);

  const fetchTickets = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('isPublic', true),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      setTickets(response.documents);
      
      // Extraire les types uniques
      const uniqueTypes = [...new Set(response.documents.map(t => t.type))];
      setTypes(uniqueTypes);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filtre par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Filtre par recherche
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search) || 
        t.content.toLowerCase().includes(search)
      );
    }

    setFilteredTickets(filtered);
  };

  const resetFilters = () => {
    setSelectedType('all');
    setSearchTerm('');
  };

  const getTypeColor = (type) => {
    const colors = {
      'Info': { bg: '#e3f2fd', color: '#1976d2' },
      'Actualité': { bg: '#fff3e0', color: '#f57c00' },
      'Événement': { bg: '#f3e5f5', color: '#7b1fa2' },
      'Annonce': { bg: '#ffebee', color: '#c62828' },
      'Blog': { bg: '#e8f5e9', color: '#388e3c' },
      'Tutoriel': { bg: '#fce4ec', color: '#c2185b' },
      'Autre': { bg: '#f5f5f5', color: '#616161' }
    };
    return colors[type] || colors['Autre'];
  };

  return (
    <div style={styles.container}>
      {/* Header avec animation */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>📰 Nos Nouvelles</h1>
          <p style={styles.heroSubtitle}>
            Découvrez toutes nos actualités, événements et articles
          </p>
          <div style={styles.heroStats}>
            <div style={styles.statBadge}>
              <span style={styles.statNumber}>{tickets.length}</span>
              <span style={styles.statLabel}>nouvelles</span>
            </div>
            <div style={styles.statBadge}>
              <span style={styles.statNumber}>{types.length}</span>
              <span style={styles.statLabel}>catégories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Rechercher dans les nouvelles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtres par type */}
      <div style={styles.filterSection}>
        <div style={styles.filterHeader}>
          <h3 style={styles.filterTitle}>Filtrer par catégorie</h3>
          {(selectedType !== 'all' || searchTerm) && (
            <button onClick={resetFilters} style={styles.resetBtn}>
              🔄 Réinitialiser
            </button>
          )}
        </div>
        
        <div style={styles.filterButtons}>
          <button
            onClick={() => setSelectedType('all')}
            style={{
              ...styles.filterBtn,
              ...(selectedType === 'all' ? styles.filterBtnActive : {}),
              backgroundColor: selectedType === 'all' ? '#4a9eff' : '#fff',
              color: selectedType === 'all' ? '#fff' : '#333',
            }}
          >
            <span style={styles.filterBtnIcon}>🌟</span>
            <span>Toutes</span>
            <span style={styles.filterBadge}>{tickets.length}</span>
          </button>
          
          {types.map((type) => {
            const typeColor = getTypeColor(type);
            const count = tickets.filter(t => t.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  ...styles.filterBtn,
                  ...(selectedType === type ? {
                    backgroundColor: typeColor.bg,
                    borderColor: typeColor.color,
                    color: typeColor.color,
                  } : {}),
                }}
              >
                <span>{type}</span>
                <span style={{
                  ...styles.filterBadge,
                  backgroundColor: selectedType === type ? typeColor.color : '#ddd',
                  color: selectedType === type ? '#fff' : '#666',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div style={styles.loadingSection}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des nouvelles...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            {searchTerm ? '🔍' : '📭'}
          </div>
          <h3 style={styles.emptyTitle}>
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucune nouvelle disponible'}
          </h3>
          <p style={styles.emptyText}>
            {searchTerm 
              ? `Aucune nouvelle ne correspond à "${searchTerm}"`
              : 'Aucune nouvelle ne correspond à vos critères de recherche.'
            }
          </p>
          {(selectedType !== 'all' || searchTerm) && (
            <button onClick={resetFilters} style={styles.emptyButton}>
              Voir toutes les nouvelles
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Info résultats */}
          <div style={styles.resultsInfo}>
            <p style={styles.resultsText}>
              {filteredTickets.length === tickets.length ? (
                <>Affichage de <strong>toutes les {tickets.length}</strong> nouvelles</>
              ) : (
                <>Affichage de <strong>{filteredTickets.length}</strong> nouvelle{filteredTickets.length > 1 ? 's' : ''} sur {tickets.length}</>
              )}
            </p>
          </div>

          {/* Grille de tickets */}
          <div style={styles.ticketsGrid}>
            {filteredTickets.map((ticket, index) => {
              const typeColor = getTypeColor(ticket.type);
              return (
                <article 
                  key={ticket.$id} 
                  style={{
                    ...styles.ticketCard,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={styles.ticketHeader}>
                    <span style={{
                      ...styles.ticketType,
                      backgroundColor: typeColor.bg,
                      color: typeColor.color,
                    }}>
                      {ticket.type}
                    </span>
                    <time style={styles.ticketDate}>
                      {new Date(ticket.$createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <h2 style={styles.ticketTitle}>{ticket.title}</h2>
                  
                  <p style={styles.ticketContent}>
                    {ticket.content.length > 200 
                      ? ticket.content.substring(0, 200) + '...' 
                      : ticket.content
                    }
                  </p>
                  
                  <div style={styles.ticketFooter}>
                    <button style={styles.readMoreBtn}>
                      Lire plus →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Section statistiques en bas */}
      {!loading && tickets.length > 0 && (
        <div style={styles.bottomStats}>
          <h3 style={styles.bottomStatsTitle}>📊 Statistiques</h3>
          <div style={styles.statsGrid}>
            {types.map((type) => {
              const typeColor = getTypeColor(type);
              const count = tickets.filter(t => t.type === type).length;
              const percentage = Math.round((count / tickets.length) * 100);
              
              return (
                <div key={type} style={styles.statCard}>
                  <div style={styles.statCardHeader}>
                    <span style={{
                      ...styles.statCardType,
                      backgroundColor: typeColor.bg,
                      color: typeColor.color,
                    }}>
                      {type}
                    </span>
                  </div>
                  <div style={styles.statCardBody}>
                    <div style={styles.statCardNumber}>{count}</div>
                    <div style={styles.statCardLabel}>article{count > 1 ? 's' : ''}</div>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${percentage}%`,
                          backgroundColor: typeColor.color,
                        }}
                      />
                    </div>
                    <div style={styles.statCardPercentage}>{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0',
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '4rem 2rem',
    borderRadius: '0 0 30px 30px',
    marginBottom: '3rem',
    color: '#fff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    fontWeight: '800',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '2rem',
    opacity: '0.95',
  },
  heroStats: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '1rem 2rem',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    display: 'block',
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: '0.9',
  },
  searchSection: {
    padding: '0 2rem 2rem',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto',
  },
  searchInput: {
    width: '100%',
    padding: '1rem 3rem 1rem 1.5rem',
    fontSize: '1.1rem',
    border: '2px solid #ddd',
    borderRadius: '50px',
    outline: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  },
  clearBtn: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#e0e0e0',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '20px',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginLeft: '2rem',
    marginRight: '2rem',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  filterTitle: {
    fontSize: '1.4rem',
    color: '#1a1a2e',
    fontWeight: '700',
  },
  resetBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#f5f5f5',
    border: '2px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  filterButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  filterBtnIcon: {
    fontSize: '1.2rem',
  },
  filterBadge: {
    backgroundColor: '#e0e0e0',
    color: '#666',
    padding: '0.2rem 0.6rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    minWidth: '25px',
    textAlign: 'center',
  },
  filterBtnActive: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  loadingSection: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '20px',
    margin: '0 2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '2rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  emptyButton: {
    padding: '1rem 2rem',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resultsInfo: {
    padding: '0 2rem 1rem',
  },
  resultsText: {
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
  },
  ticketsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    padding: '0 2rem 3rem',
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    animation: 'fadeInUp 0.6s ease-out',
    animationFillMode: 'both',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '0.8rem',
  },
  ticketType: {
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  ticketDate: {
    fontSize: '0.9rem',
    color: '#999',
    fontWeight: '500',
  },
  ticketTitle: {
    fontSize: '1.6rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
    lineHeight: '1.4',
    fontWeight: '700',
  },
  ticketContent: {
    color: '#555',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  ticketFooter: {
    borderTop: '2px solid #f0f0f0',
    paddingTop: '1rem',
  },
  readMoreBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  bottomStats: {
    padding: '3rem 2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '30px 30px 0 0',
    marginTop: '3rem',
  },
  bottomStatsTitle: {
    fontSize: '2rem',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: '700',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  },
  statCardHeader: {
    marginBottom: '1rem',
  },
  statCardType: {
    padding: '0.4rem 1rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statCardBody: {
    textAlign: 'center',
  },
  statCardNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '0.3rem',
  },
  statCardLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.6s ease-out',
    borderRadius: '10px',
  },
  statCardPercentage: {
    fontSize: '0.85rem',
    color: '#999',
    fontWeight: '600',
  },
};