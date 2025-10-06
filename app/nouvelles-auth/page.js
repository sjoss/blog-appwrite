'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { databases, DATABASE_ID, COLLECTION_ID, account } from '@/lib/appwrite';
import { Query } from 'appwrite';

export default function NouvellesAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [selectedType, showPrivateOnly, tickets]);

  const checkAuth = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
      fetchTickets();
    } catch (error) {
      // Non authentifié, rediriger vers admin pour se connecter
      router.push('/admin');
    }
  };

  const fetchTickets = async () => {
    try {
      // Récupérer TOUS les tickets (publics et privés)
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
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

    // Filtre privé/public
    if (showPrivateOnly) {
      filtered = filtered.filter(t => !t.isPublic);
    }

    // Filtre par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    setFilteredTickets(filtered);
  };

  if (loading || !user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Vérification de l&apos;authentification...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nouvelles authentifiées</h1>
        <p style={styles.subtitle}>
          Bienvenue {user.name} ! Accédez à tout le contenu, y compris privé.
        </p>
      </div>

      {/* Filtres */}
      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          <div>
            <label style={styles.filterLabel}>Filtrer par type :</label>
            <div style={styles.filterButtons}>
              <button
                onClick={() => setSelectedType('all')}
                style={{
                  ...styles.filterBtn,
                  ...(selectedType === 'all' ? styles.filterBtnActive : {})
                }}
              >
                Tous
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedType === type ? styles.filterBtnActive : {})
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.toggleContainer}>
            <label style={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showPrivateOnly}
                onChange={(e) => setShowPrivateOnly(e.target.checked)}
                style={styles.checkbox}
              />
              Afficher uniquement le contenu privé
            </label>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div style={styles.quickStats}>
        <div style={styles.statBadge}>
          📊 Total: {tickets.length}
        </div>
        <div style={styles.statBadge}>
          🌍 Publiques: {tickets.filter(t => t.isPublic).length}
        </div>
        <div style={styles.statBadge}>
          🔒 Privées: {tickets.filter(t => !t.isPublic).length}
        </div>
        <div style={styles.statBadge}>
          👁️ Affichées: {filteredTickets.length}
        </div>
      </div>

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div style={styles.noResults}>
          <div style={styles.noResultsIcon}>🔍</div>
          <h3>Aucune nouvelle trouvée</h3>
          <p>Aucune nouvelle ne correspond à vos filtres.</p>
        </div>
      ) : (
        <div style={styles.ticketsGrid}>
          {filteredTickets.map((ticket) => (
            <article key={ticket.$id} style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <div style={styles.ticketBadges}>
                  <span style={styles.ticketType}>{ticket.type}</span>
                  {!ticket.isPublic && (
                    <span style={styles.privateBadge}>🔒 Privé</span>
                  )}
                </div>
                <span style={styles.ticketDate}>
                  {new Date(ticket.$createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <h2 style={styles.ticketTitle}>{ticket.title}</h2>
              
              <p style={styles.ticketContent}>{ticket.content}</p>
              
              <div style={styles.ticketFooter}>
                <span style={styles.ticketAuthor}>
                  👤 Auteur: {ticket.authorId.slice(0, 8)}...
                </span>
                <span style={styles.ticketId}>
                  ID: {ticket.$id.slice(0, 8)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4a9eff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  filterLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.8rem',
    display: 'block',
  },
  filterButtons: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#f5f5f5',
    border: '2px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s',
  },
  filterBtnActive: {
    backgroundColor: '#4a9eff',
    color: '#fff',
    borderColor: '#4a9eff',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#333',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  quickStats: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  statBadge: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#fff',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  noResults: {
    textAlign: 'center',
    padding: '4rem 1rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  noResultsIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  ticketsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: '1.8rem',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '0.5rem',
  },
  ticketBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  ticketType: {
    padding: '0.4rem 1rem',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  privateBadge: {
    padding: '0.4rem 1rem',
    backgroundColor: '#ffe3e3',
    color: '#c62828',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  ticketDate: {
    fontSize: '0.85rem',
    color: '#999',
    whiteSpace: 'nowrap',
  },
  ticketTitle: {
    fontSize: '1.5rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
    lineHeight: '1.3',
  },
  ticketContent: {
    color: '#555',
    lineHeight: '1.7',
    marginBottom: '1.5rem',
  },
  ticketFooter: {
    borderTop: '1px solid #eee',
    paddingTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  ticketAuthor: {
    fontSize: '0.85rem',
    color: '#666',
  },
  ticketId: {
    fontSize: '0.8rem',
    color: '#bbb',
    fontFamily: 'monospace',
  },
};