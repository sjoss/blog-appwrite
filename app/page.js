'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

export default function Home() {
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTickets();
  }, []);

  const fetchRecentTickets = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('isPublic', true),
          Query.orderDesc('$createdAt'),
          Query.limit(3)
        ]
      );
      setRecentTickets(response.documents);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Bienvenue sur Mon Blog</h1>
        <p style={styles.subtitle}>
          Découvrez nos dernières nouvelles et articles
        </p>
        <div style={styles.ctaButtons}>
          <Link href="/nouvelles" style={styles.primaryBtn}>
            Voir toutes les nouvelles
          </Link>
          <Link href="/contact" style={styles.secondaryBtn}>
            Nous contacter
          </Link>
        </div>
      </section>

      <section style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Dernières nouvelles</h2>
        
        {loading ? (
          <p style={styles.loading}>Chargement...</p>
        ) : recentTickets.length === 0 ? (
          <p style={styles.noTickets}>Aucune nouvelle pour le moment.</p>
        ) : (
          <div style={styles.ticketGrid}>
            {recentTickets.map((ticket) => (
              <article key={ticket.$id} style={styles.ticketCard}>
                <div style={styles.ticketType}>{ticket.type}</div>
                <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                <p style={styles.ticketContent}>
                  {ticket.content.substring(0, 150)}
                  {ticket.content.length > 150 ? '...' : ''}
                </p>
                <div style={styles.ticketFooter}>
                  <span style={styles.ticketDate}>
                    {new Date(ticket.$createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {recentTickets.length > 0 && (
          <div style={styles.viewAllContainer}>
            <Link href="/nouvelles" style={styles.viewAllBtn}>
              Voir toutes les nouvelles →
            </Link>
          </div>
        )}
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📰</div>
            <h3 style={styles.featureTitle}>Nouvelles</h3>
            <p style={styles.featureText}>
              Consultez nos dernières actualités et articles
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Contenu privé</h3>
            <p style={styles.featureText}>
              Accédez à du contenu exclusif après connexion
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>✉️</div>
            <h3 style={styles.featureTitle}>Contact</h3>
            <p style={styles.featureText}>
              Contactez-nous facilement via notre formulaire
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 1rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    marginBottom: '3rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#666',
    marginBottom: '2rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#4a9eff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  secondaryBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    color: '#4a9eff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid #4a9eff',
  },
  recentSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#1a1a2e',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#666',
  },
  noTickets: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#666',
    padding: '3rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  ticketCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  ticketType: {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  ticketTitle: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#1a1a2e',
  },
  ticketContent: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  ticketFooter: {
    borderTop: '1px solid #eee',
    paddingTop: '1rem',
  },
  ticketDate: {
    fontSize: '0.9rem',
    color: '#999',
  },
  viewAllContainer: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  viewAllBtn: {
    display: 'inline-block',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#fff',
    color: '#4a9eff',
    textDecoration: 'none',
    borderRadius: '8px',
    border: '2px solid #4a9eff',
    fontSize: '1rem',
    fontWeight: '600',
  },
  featuresSection: {
    marginTop: '4rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#1a1a2e',
  },
  featureText: {
    color: '#666',
    lineHeight: '1.6',
  },
};