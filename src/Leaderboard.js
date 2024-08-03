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

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username || "Anonymous"}</td>
              <td>{user.tokens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
