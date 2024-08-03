// TokenManager.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import Leaderboard from './Leaderboard';
import { v4 as uuidv4 } from 'uuid';
import './leaderboardStyles.css'; // Import the CSS file

const TokenManager = () => {
  const [tokens, setTokens] = useState(0);
  const [user, setUser] = useState(null);
  const [tokenIds, setTokenIds] = useState([]);
  let username = '';
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setTokens(userData.tokens);
          username = userData.username;
          setTokenIds(userData.token_ids || []);
          setIsOrganizer(docSnap.data().isOrganizer);
          if (localStorage.getItem('isOrganizer') === 'true') {
            setIsOrganizer(true);
          } else {
            setIsOrganizer(false);
          }
        } else {
          await setDoc(docRef, { tokens: 0, token_ids: [] });
          setTokens(0);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addToken = async () => {
    if (user) {
      const tokenId = uuidv4();
      const newTokenCount = tokens + 1;
      const updatedTokenIds = [...tokenIds, tokenId];

      setTokens(newTokenCount);
      setTokenIds(updatedTokenIds);

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { tokens: newTokenCount, token_ids: updatedTokenIds });
      await addDoc(collection(db, 'tokens'), {
        id: tokenId,
        user: username,
      });
    } else {
      console.error('User is not authenticated');
    }
  };

  const subtractToken = async () => {
    if (user && tokens > 0) {
      const newTokenCount = tokens - 1;
      const updatedTokenIds = tokenIds.slice(0, -1);

      setTokens(newTokenCount);
      setTokenIds(updatedTokenIds);

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { tokens: newTokenCount, token_ids: updatedTokenIds });
    } else {
      console.error('User is not authenticated or no tokens to subtract');
    }
  };

  return (
    <div className="token-manager-container">
      {isOrganizer && (
        <div>
          <h2 className="token-manager-title">Token Balance: {tokens}</h2>
          <div className="token-manager-buttons">
            <button onClick={addToken}>Add +1 Token</button>
            <button onClick={subtractToken}>Subtract -1 Token</button>
          </div>
        </div>
      )}
      <Leaderboard />
    </div>
  );
};

export default TokenManager;
