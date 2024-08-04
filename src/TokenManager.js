import React, { useState, useEffect } from 'react';
import { auth, db } from './FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import Leaderboard from './Leaderboard';
import { v4 as uuidv4 } from 'uuid';

const TokenManager = () => {
  const [tokens, setTokens] = useState(0);
  const [user, setUser] = useState(null);
  const [tokenIds, setTokenIds] = useState([]);
  const [inputUsername, setInputUsername] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [updatedTotal, setUpdatedTotal] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setTokens(userData.tokens);
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

  const updateTokens = async (username, increment) => {
    try {
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('username', '==', username));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (userDoc) => {
          const userData = userDoc.data();
          const newTokenCount = userData.tokens + increment;
          const updatedTokenIds = increment > 0 ? [...userData.token_ids, uuidv4()] : userData.token_ids.slice(0, -1);

          await updateDoc(userDoc.ref, {
            tokens: newTokenCount,
            token_ids: updatedTokenIds,
          });

          if (increment > 0) {
            await addDoc(collection(db, 'tokens'), {
              id: uuidv4(),
              user: username,
            });
          }

          // Update the displayed token count for the user
          setUpdatedTotal(newTokenCount);
        });
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  };

  const checkCurrentTokens = async (username) => {
    try {
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('username', '==', username));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          setUpdatedTotal(userData.tokens);
        });
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const handleAddToken = () => updateTokens(inputUsername, 1);
  const handleSubtractToken = () => updateTokens(inputUsername, -1);
  const handleCheckCurrentTokens = () => checkCurrentTokens(inputUsername);

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#4b824c',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      color: '#E2E2B6',
      marginBottom: '20px',
      fontSize: '2rem',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
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
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      marginBottom: '10px',
      width: '100%',
    },
    updatedTotalBox: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      marginTop: '10px',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      fontSize: '1.2rem',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      {isOrganizer && (
        <div>
          <h2 style={styles.title}>Token Management</h2>
          <input
            type="text"
            placeholder="Enter username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={handleAddToken}
            >
              Add +1 Token
            </button>
            <button
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={handleCheckCurrentTokens}
            >
              Check Current Tokens
            </button>
            <button
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={handleSubtractToken}
            >
              Subtract -1 Token
            </button>
          </div>
          {updatedTotal !== null && (
            <div style={styles.updatedTotalBox}>
              New Token Total: {updatedTotal}
            </div>
          )}
        </div>
      )}
      <Leaderboard />
    </div>
  );
};

export default TokenManager;
