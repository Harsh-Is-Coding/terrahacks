import React, { useState, useEffect } from 'react';
import { auth, db } from './FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import Leaderboard from './Leaderboard';
import { v4 as uuidv4 } from 'uuid';

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
          setIsOrganizer(userData.isOrganizer);
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

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
      fontSize: '2rem',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px', // Space between buttons
      marginBottom: '20px',
    },
    button: {
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

  return (
    <div style={styles.container}>
      {isOrganizer && (
        <div>
          <h2 style={styles.title}>Token Balance: {tokens}</h2>
          <div style={styles.buttonContainer}>
            <button
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={addToken}
            >
              Add +1 Token
            </button>
            <button
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={subtractToken}
            >
              Subtract -1 Token
            </button>
          </div>
        </div>
      )}
      <Leaderboard />
    </div>
  );
};

export default TokenManager;
