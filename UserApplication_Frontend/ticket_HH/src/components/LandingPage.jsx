import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg text-center backdrop-blur-md">
        <h1 className="text-5xl font-bold text-white mb-6">Identicket</h1>
        <p className="text-gray-100 text-xl mb-8">Book your train tickets on web3 and check in a second</p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block bg-white text-indigo-500 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-50 transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;