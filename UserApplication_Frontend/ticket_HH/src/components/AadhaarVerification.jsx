import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react';

const AadhaarVerification = () => {
  const [anonAadhaar] = useAnonAadhaar();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    console.log('Anon Aadhaar status:', anonAadhaar.status);
    if (anonAadhaar.status === 'logged-in') {
      const username = localStorage.getItem('username');
      const userId = localStorage.getItem('userId');
      setUserDetails({ username, userId });

      // Update auth status on the server
      fetch('https://ticket-backend-j37d.onrender.com/update-auth-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Auth status updated:', data);
          // Navigate to dashboard after a short delay
          setTimeout(() => navigate('/dashboard'), 3000);
        })
        .catch(error => console.error('Error updating auth status:', error));
    }
  }, [anonAadhaar, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Verify Aadhaar</h2>
        <div className="mt-8 space-y-6">
          <LogInWithAnonAadhaar nullifierSeed={7745724286022112881059541887210226} />
          {anonAadhaar.status === 'logging-in' && (
            <p className="text-center text-white">Verifying your Aadhaar...</p>
          )}
          {anonAadhaar.status === 'logged-in' && (
            <div className="text-white">
              <p className="text-center text-green-500 mb-4">✅ Aadhaar verified successfully!</p>
              {userDetails && (
                <div>
                  <p><strong>Username:</strong> {userDetails.username}</p>
                  <p><strong>User ID:</strong> {userDetails.userId}</p>
                </div>
              )}
              <p className="text-center mt-4">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;