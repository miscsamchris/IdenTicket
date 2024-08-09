import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Pass = () => {
  const [pass, setPass] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPass();
  }, [id]);

  const fetchPass = async () => {
    try {
      const response = await fetch(`https://ticket-backend-j37d.onrender.com/pass/${id}`);
      if (response.ok) {
        const passData = await response.json();
        setPass(passData);
      } else {
        console.error('Failed to fetch pass');
      }
    } catch (error) {
      console.error('Error fetching pass:', error);
    }
  };

  if (!pass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const passData = JSON.stringify(pass);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Your Pass</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 space-y-2">
            <p className="text-gray-800"><span className="font-semibold">Type:</span> Daily Pass</p>
            <p className="text-gray-800"><span className="font-semibold">Valid until:</span> {new Date(pass.validUntil).toLocaleDateString()}</p>
            <p className="text-gray-800"><span className="font-semibold">Price:</span> ₹{pass.price}</p>
            <p className="text-gray-800"><span className="font-semibold">Status:</span> 
              <span className={pass.validationStatus ? 'text-green-600' : 'text-red-600'}>
                {pass.validationStatus ? 'Validated' : 'Not Validated'}
              </span>
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <QRCode value={passData} size={200} level="H" renderAs="svg" />
          </div>
        </div>
        <p className="text-sm text-gray-300 text-center mt-4">
          Please show this QR code to the conductor when requested.
        </p>
      </div>
    </div>
  );
};

export default Pass;