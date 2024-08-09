import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PassList = () => {
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`https://ticket-backend-j37d.onrender.com/passes?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setPasses(data);
      } else {
        console.error('Failed to fetch passes');
      }
    } catch (error) {
      console.error('Error fetching passes:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">My Passes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passes.map((pass) => (
          <Link to={`/pass/${pass.passId}`} key={pass.passId} className="block">
            <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2 text-white">Daily Pass</h3>
              <p className="text-gray-300">Valid until: {new Date(pass.validUntil).toLocaleDateString()}</p>
              <p className="text-gray-300">Price: ₹{pass.price}</p>
              <p className="text-gray-300">Status: 
                <span className={pass.validationStatus ? 'text-green-400' : 'text-red-400'}>
                  {pass.validationStatus ? ' Validated' : ' Not Validated'}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PassList;