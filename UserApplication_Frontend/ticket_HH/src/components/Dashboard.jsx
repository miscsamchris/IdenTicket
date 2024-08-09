import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600">
      <nav className="bg-white bg-opacity-10 backdrop-blur-md p-4 sticky top-0 z-10">
        <ul className="flex justify-center space-x-6">
          <li><Link to="/dashboard" className="text-white hover:text-indigo-300 transition duration-300">Home</Link></li>
          <li><Link to="/dashboard/tickets" className="text-white hover:text-indigo-300 transition duration-300">My Tickets</Link></li>
          <li><Link to="/dashboard/passes" className="text-white hover:text-indigo-300 transition duration-300">My Passes</Link></li>
          <li><Link to="/dashboard/profile" className="text-white hover:text-indigo-300 transition duration-300">Profile</Link></li>
          <li><button onClick={handleLogout} className="text-white hover:text-indigo-300 transition duration-300">Logout</button></li>
        </ul>
      </nav>
      <div className="container mx-auto p-4">
        {location.pathname === '/dashboard' ? (
          <div className="flex flex-col items-center justify-center space-y-6 mt-16">
            <h2 className="text-4xl font-bold text-white mb-8">Welcome to Your Dashboard</h2>
            <Link to="/dashboard/ticket-booking" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
              Buy Ticket
            </Link>
            <Link to="/dashboard/pass-booking" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
              Buy Pass
            </Link>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard;