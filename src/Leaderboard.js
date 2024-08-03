// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { db } from './FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Exclude users who are organizers
        if (!userData.isOrganizer) {
          usersData.push({ id: doc.id, ...userData });
        }
      });
      // Sort users by tokens in descending order
      usersData.sort((a, b) => b.tokens - a.tokens);
      setUsers(usersData);
    };

    fetchLeaderboard();
  }, []);

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
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#007bff',
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
    },
    gold: {
      backgroundColor: '#ffd700',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    silver: {
      backgroundColor: '#c0c0c0',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    bronze: {
      backgroundColor: '#cd7f32',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    hover: {
      backgroundColor: '#e9ecef',
      transform: 'scale(1.02)',
    },
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
            else if (index % 2 !== 0) rowStyle = { ...rowStyle, ...styles.trOdd };

            return (
              <tr
                key={user.id}
                style={rowStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.hover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowStyle.backgroundColor}
              >
                <td style={styles.td}>{index + 1}</td>
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

export default Leaderboard;
