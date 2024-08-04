import React, { useState, useEffect } from 'react';
import { db } from './FirebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import confetti from 'canvas-confetti';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('isOrganizer', '==', false));
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push({ id: doc.id, ...userData });
      });
      usersData.sort((a, b) => b.tokens - a.tokens);
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  const handleRowClick = (user) => {
    if (user.tokens === Math.max(...users.map(u => u.tokens))) {
      // Trigger confetti animation for the top user
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Leaderboard</h2>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            let rowStyle = {};
            if (index === 0) rowStyle = styles.gold;
            else if (index === 1) rowStyle = styles.silver;
            else if (index === 2) rowStyle = styles.bronze;

            return (
              <tr
                key={user.id}
                style={{
                  ...styles.row,
                  ...rowStyle,
                  backgroundColor: hoveredRow === user.id ? styles.hover.backgroundColor : rowStyle.backgroundColor,
                }}
                onMouseEnter={() => setHoveredRow(user.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick(user)}
              >
                <td style={styles.td}>
                  {index < medals.length ? medals[index] : index + 1}
                </td>
                <td style={styles.td}>{user.username || "Anonymous"}</td>
                <td style={styles.td}>{user.tokens}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <style>
        {`
          tr {
            transition: transform 0.3s ease;
          }
          tr:hover {
            transform: scale(1.02);
          }
        `}
      </style>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(168, 213, 186, 0.5)',  // Light green background with transparency
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
    fontSize: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#2B702E',  // Dark green
    color: 'white',
  },
  th: {
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  row: {
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  gold: {
    backgroundColor: '#ffd700',
  },
  silver: {
    backgroundColor: '#c0c0c0',
  },
  bronze: {
    backgroundColor: '#cd7f32',
  },
  hover: {
    backgroundColor: '#e9ecef',
  },
};

export default Leaderboard;
