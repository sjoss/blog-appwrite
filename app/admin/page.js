'use client';

import { useState, useEffect } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  
  // États du formulaire de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // États du formulaire de ticket
  const [ticketForm, setTicketForm] = useState({
    title: '',
    content: '',
    type: 'event',
    isPublic: true
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setAuthError('Email ou mot de passe incorrect');
      console.error('Erreur de connexion:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setAuthError(error.message || 'Erreur lors de l\'inscription');
      console.error('Erreur d\'inscription:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          title: ticketForm.title,
          content: ticketForm.content,
          type: ticketForm.type,
          isPublic: ticketForm.isPublic,
          authorId: user.$id
        }
      );

      setSubmitSuccess(true);
      setTicketForm({
        title: '',
        content: '',
        type: 'Info',
        isPublic: true
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError('Erreur lors de la création du ticket');
      console.error('Erreur:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Page de connexion/inscription
  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h1 style={styles.authTitle}>
            {showLogin ? 'Connexion Admin' : 'Inscription'}
          </h1>
          
          {authError && (
            <div style={styles.errorAlert}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={showLogin ? handleLogin : handleRegister} style={styles.authForm}>
            {!showLogin && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Votre nom"
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="votre@email.com"                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                style={styles.button}
                disabled={authLoading}
              >
                {authLoading
                  ? showLogin
                    ? 'Connexion...'
                    : 'Inscription...'
                  : showLogin
                    ? 'Se connecter'
                    : "S'inscrire"}
              </button>
            </form>

            <p style={styles.switchText}>
              {showLogin ? (
                <>
                  Pas encore de compte ?{' '}
                  <a
                    href="#"
                    onClick={() => setShowLogin(false)}
                    style={styles.link}
                  >
                    Créer un compte
                  </a>
                </>
              ) : (
                <>
                  Déjà inscrit ?{' '}
                  <a
                    href="#"
                    onClick={() => setShowLogin(true)}
                    style={styles.link}
                  >
                    Se connecter
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
    );
  }

  // Page d'administration (création de ticket)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Espace Admin</h1>
      <p>Connecté en tant que {user.name || user.email}</p>

      <form onSubmit={handleTicketSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Titre</label>
          <input
            type="text"
            name="title"
            value={ticketForm.title}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contenu</label>
          <textarea
            name="content"
            value={ticketForm.content}
            onChange={handleInputChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Type</label>
          <select
            name="type"
            value={ticketForm.type}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="event">event</option>
            <option value="news">news</option>
          </select>
        </div>

        <div style={styles.formGroupCheckbox}>
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={ticketForm.isPublic}
              onChange={handleInputChange}
            />{' '}
            Ticket public
          </label>
        </div>

        {submitError && (
          <div style={styles.errorAlert}>⚠️ {submitError}</div>
        )}
        {submitSuccess && (
          <div style={styles.successAlert}>✅ Ticket créé avec succès</div>
        )}

        <button
          type="submit"
          style={styles.button}
          disabled={submitLoading}
        >
          {submitLoading ? 'Envoi...' : 'Créer le ticket'}
        </button>
      </form>

      <button
        onClick={async () => {
          await account.deleteSession('current');
          setUser(null);
        }}
        style={styles.logoutButton}
      >
        Se déconnecter
      </button>
    </div>
  );
}

// --- Styles inline ---
const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    background: '#f9f9f9',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: { fontSize: 24, marginBottom: 20 },
  form: { textAlign: 'left' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontWeight: 600 },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  formGroupCheckbox: { marginBottom: 16 },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: 10,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  },
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f6fa',
  },
  authBox: {
    background: 'white',
    padding: 40,
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: 350,
  },
  authTitle: { textAlign: 'center', marginBottom: 20 },
  authForm: { textAlign: 'left' },
  errorAlert: {
    background: '#ffe6e6',
    color: '#e74c3c',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  successAlert: {
    background: '#e6ffe6',
    color: '#2ecc71',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  switchText: { textAlign: 'center', marginTop: 12 },
  link: { color: '#0070f3', cursor: 'pointer' },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #0070f3',
    borderRadius: '50%',
    width: 30,
    height: 30,
    animation: 'spin 1s linear infinite',
  },
};
