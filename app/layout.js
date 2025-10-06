'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <html lang="fr">
      <body>
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <Link href="/" style={styles.logo}>
              Mon Blog
            </Link>
            
            <div style={styles.navLinks}>
              <Link 
                href="/" 
                style={{...styles.navLink, ...(isActive('/') ? styles.navLinkActive : {})}}
              >
                Accueil
              </Link>
              <Link 
                href="/nouvelles" 
                style={{...styles.navLink, ...(isActive('/nouvelles') ? styles.navLinkActive : {})}}
              >
                Nouvelles
              </Link>
              <Link 
                href="/contact" 
                style={{...styles.navLink, ...(isActive('/contact') ? styles.navLinkActive : {})}}
              >
                Contact
              </Link>
              
              {user && (
                <>
                  <Link 
                    href="/nouvelles-auth" 
                    style={{...styles.navLink, ...(isActive('/nouvelles-auth') ? styles.navLinkActive : {})}}
                  >
                    Nouvelles Privées
                  </Link>
                  <Link 
                    href="/admin" 
                    style={{...styles.navLink, ...(isActive('/admin') ? styles.navLinkActive : {})}}
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>

            <div style={styles.authSection}>
              {loading ? (
                <span style={styles.userInfo}>Chargement...</span>
              ) : user ? (
                <>
                  <span style={styles.userInfo}>👤 {user.name}</span>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/admin" style={styles.loginBtn}>
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main style={styles.main}>
          {children}
        </main>

        <footer style={styles.footer}>
          <p>© 2025 Mon Blog - Propulsé par Next.js & Appwrite</p>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#ccc',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontSize: '1rem',
  },
  navLinkActive: {
    color: '#4a9eff',
    fontWeight: '600',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    color: '#fff',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  loginBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4a9eff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  main: {
    minHeight: 'calc(100vh - 140px)',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  footer: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    textAlign: 'center',
    padding: '1.5rem',
    marginTop: 'auto',
  },
};