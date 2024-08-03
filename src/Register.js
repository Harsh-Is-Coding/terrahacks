import React, { useState } from 'react';
import { auth, db } from './FirebaseConfig'; // Ensure 'auth' and 'db' are correctly imported
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Use uuid for generating unique user IDs

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: uuidv4(),
        token_ids: [""],
        username: username,
        email: email,
        tokens: 0,
        isOrganizer: isOrganizer,
      });

      console.log('Registered successfully');
      localStorage.setItem('isOrganizer', isOrganizer);
      console.log('User registered:', isOrganizer);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <div style={styles.checkboxContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isOrganizer}
              onChange={(e) => setIsOrganizer(e.target.checked)}
              style={styles.checkbox}
            />
            Register as Organizer
          </label>
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Register
        </button>
      </form>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease-in-out',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontSize: '2rem',
    fontFamily: '"Montserrat", sans-serif',
    animation: 'fadeIn 1s ease-in-out',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  checkboxContainer: {
    margin: '10px 0',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
  },
  checkbox: {
    marginRight: '10px',
  },
  button: {
    width: '100%',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    backgroundColor: '#007bff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Register;
