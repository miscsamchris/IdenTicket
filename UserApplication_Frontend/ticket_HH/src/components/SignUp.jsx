import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [metamaskAddress, setMetamaskAddress] = useState('');
  const [petraAddress, setPetraAddress] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        setMetamaskAddress(address);
        localStorage.setItem('metamaskAddress', address);
      } catch (error) {
        console.error("Failed to connect to Metamask:", error);
      }
    } else {
      alert("Please install Metamask extension!");
    }
  };

  const connectPetra = async () => {
    if (window.aptos) {
      try {
        const wallet = window.aptos;
        const response = await wallet.connect();
        setPetraAddress(response.address);
        localStorage.setItem('petraAddress', response.address);
      } catch (error) {
        console.error("Failed to connect to Petra wallet:", error);
      }
    } else {
      window.open('https://petra.app/', '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && metamaskAddress && petraAddress) {
      const userData = { 
        username, 
        metamask: metamaskAddress, 
        petraWallet: petraAddress
      };
      console.log('User data to be sent:', userData); // Log user data
      try {
        const response = await fetch('https://ticket-backend-j37d.onrender.com/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          const data = await response.json();
          console.log('User registered successfully:', data);
          navigate('/login');
        } else {
          const errorData = await response.json();
          console.log('Error data:', errorData); // Log error data
          setError(errorData.error || 'Failed to register');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while registering');
      }
    } else {
      setError("Please fill in all fields and connect both wallets.");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <button
            type="button"
            onClick={connectMetamask}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {metamaskAddress ? `Metamask Connected: ${metamaskAddress.slice(0, 6)}...${metamaskAddress.slice(-4)}` : 'Connect Metamask'}
          </button>
          <button
            type="button"
            onClick={connectPetra}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {petraAddress ? `Petra Connected: ${petraAddress.slice(0, 6)}...${petraAddress.slice(-4)}` : 'Connect Petra Wallet'}
          </button>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;