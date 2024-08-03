import React, { useState } from 'react';
import { auth, db } from './FirebaseConfig'; // Ensure Firestore is initialized and configured
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be either email or username
  const [password, setPassword] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);

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
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
