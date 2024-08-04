import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { auth, db } from './FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be either email or username
  const [password, setPassword] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async () => {
    try {
      let userEmail = identifier;

      // Check if the identifier is a username
      if (!identifier.includes('@')) {
        // Assume identifier is a username and find the corresponding email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error('Username not found');
          return;
        }

        const userDoc = querySnapshot.docs[0];
        userEmail = userDoc.data().email;
        setIsOrganizer(userDoc.data().isOrganizer);
      }

      // Log in with the obtained email and password
      await signInWithEmailAndPassword(auth, userEmail, password);

      // Retrieve user data after login to confirm role
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setIsOrganizer(userDoc.data().isOrganizer);
          localStorage.setItem('isOrganizer', userDoc.data().isOrganizer);
          console.log('User found:', userDoc.data().isOrganizer);

          // Redirect to the appropriate page after successful login
          navigate('/'); // Replace with the desired route after login, e.g., '/dashboard'
        } else {
          console.error('User data not found');
        }
      }

      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button
        onClick={handleLogin}
        style={styles.button}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Login
      </button>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '50%',
    margin: '3% auto',
    padding: '20px',
    backgroundColor: '#80af8185',
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
  input: {
    width: '97%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
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

export default Login;
