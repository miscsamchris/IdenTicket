import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      fetchUserProfile(username);
    }
  }, []);

  const fetchUserProfile = async (username) => {
    try {
      const response = await fetch(`https://ticket-backend-j37d.onrender.com/user/${username}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Metamask Address:</strong> {user.metamaskAddress}</p>
      <p><strong>Petra Address:</strong> {user.petraAddress}</p>
    </div>
  );
};

export default Profile;