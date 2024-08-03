// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { db } from './FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './leaderboardStyles.css'; // Import the CSS file

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

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            let rowClass = '';
            if (index === 0) rowClass = 'gold';
            else if (index === 1) rowClass = 'silver';
            else if (index === 2) rowClass = 'bronze';

            return (
              <tr key={user.id} className={rowClass}>
                <td>{index + 1}</td>
                <td>{user.username || "Anonymous"}</td>
                <td>{user.tokens}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
