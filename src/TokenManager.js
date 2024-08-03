// TokenManager.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './FirebaseConfig'; // Ensure 'db' is correctly imported
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Leaderboard from './Leaderboard';

const TokenManager = () => {
  const [tokens, setTokens] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        const fetchTokens = async () => {
          const docRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setTokens(userData.tokens);
          } else {
            // If no data exists, create a new record with 0 tokens
            await setDoc(docRef, { tokens: 0 });
            setTokens(0);
          }
        };

        fetchTokens();
      }
    });

    return () => unsubscribe();
  }, []);

  const addToken = async () => {
    if (user) {
      const newTokenCount = tokens + 1;
      setTokens(newTokenCount);
      const docRef = doc(db, 'users', user.uid); // Corrected from user.id to user.uid
      await updateDoc(docRef, { tokens: newTokenCount });
    } else {
      console.error('User is not authenticated');
    }
  };

  const subtractToken = async () => {
    if (user) {
      const newTokenCount = tokens > 0 ? tokens - 1 : 0;
      setTokens(newTokenCount);
      const docRef = doc(db, 'users', user.uid); // Corrected from user.iid to user.uid
      await updateDoc(docRef, { tokens: newTokenCount });
    } else {
      console.error('User is not authenticated');
    }
  };

  return (
    <div>
      <h2>Token Balance: {tokens}</h2>
      <button onClick={addToken}>Add +1 Token</button>
      <button onClick={subtractToken}>Subtract -1 Token</button>
      <Leaderboard />
    </div>
  );
};

export default TokenManager;
