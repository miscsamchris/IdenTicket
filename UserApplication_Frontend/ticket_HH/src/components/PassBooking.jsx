import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PassBooking = () => {
  const [price] = useState(5); // Fixed price for daily pass
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    try {
      const response = await fetch('https://ticket-backend-j37d.onrender.com/passes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, username, price, validUntil }),
      });

      if (response.ok) {
        const newPass = await response.json();
        console.log('Pass created successfully:', newPass);
        navigate(`/pass/${newPass.passId}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to purchase pass:', errorData);
      }
    } catch (error) {
      console.error('Error purchasing pass:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white bg-opacity-10 rounded-lg shadow-lg p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Book a Daily Pass</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-200">Daily Pass</div>
            <div className="text-lg font-bold text-white">₹{price}</div>
          </div>
          <p className="text-sm text-gray-300">Valid for 24 hours from purchase</p>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:scale-105"
          >
            Buy Pass
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassBooking;