// Register.js
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

      // Generate a unique userID

      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: uuidv4(),
        username: username,
        email: email,
        tokens: 0,
        isOrganizer: isOrganizer,
      });

      console.log('Registered successfully');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={isOrganizer}
              onChange={(e) => setIsOrganizer(e.target.checked)}
            />
            Register as Organizer
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
