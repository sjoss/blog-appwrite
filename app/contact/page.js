'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez intégrer l'envoi d'email avec Appwrite Functions ou un service externe
    console.log('Formulaire soumis:', formData);
    setSubmitted(true);
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contactez-nous</h1>
        <p style={styles.subtitle}>
          Nous sommes à votre écoute. Envoyez-nous un message !
        </p>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formContainer}>
          {submitted ? (
            <div style={styles.successMessage}>
              <div style={styles.successIcon}>✓</div>
              <h3>Message envoyé avec succès !</h3>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Votre nom"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="votre@email.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Sujet de votre message"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={styles.textarea}
                  placeholder="Votre message..."
                  rows="6"
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                Envoyer le message
              </button>
            </form>
          )}
        </div>

        <div style={styles.infoContainer}>
          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>📧</div>
            <h3 style={styles.infoTitle}>Email</h3>
            <p style={styles.infoText}>contact@monblog.fr</p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>📱</div>
            <h3 style={styles.infoTitle}>Téléphone</h3>
            <p style={styles.infoText}>+33 1 23 45 67 89</p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>📍</div>
            <h3 style={styles.infoTitle}>Adresse</h3>
            <p style={styles.infoText}>
              123 Rue du Blog<br />
              75001 Paris, France
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>🕐</div>
            <h3 style={styles.infoTitle}>Horaires</h3>
            <p style={styles.infoText}>
              Lun - Ven: 9h - 18h<br />
              Sam - Dim: Fermé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a1a2e',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '1rem',
    backgroundColor: '#4a9eff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  successMessage: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  successIcon: {
    fontSize: '4rem',
    color: '#4caf50',
    marginBottom: '1rem',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  infoIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  infoTitle: {
    fontSize: '1.2rem',
    color: '#1a1a2e',
    marginBottom: '0.5rem',
  },
  infoText: {
    color: '#666',
    lineHeight: '1.6',
  },
};