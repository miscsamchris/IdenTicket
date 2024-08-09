import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stations = ['Margao', 'Vasco da Gama', 'Ponda', 'Mapusa'];
const prices = {
  'Margao': { 'Vasco da Gama': 10, 'Ponda': 15, 'Mapusa': 20 },
  'Vasco da Gama': { 'Margao': 10, 'Ponda': 12, 'Mapusa': 18 },
  'Ponda': { 'Margao': 15, 'Vasco da Gama': 12, 'Mapusa': 10 },
  'Mapusa': { 'Margao': 20, 'Vasco da Gama': 18, 'Ponda': 10 },
};

const TicketBooking = () => {
  const [selectedStart, setSelectedStart] = useState(stations[0]);
  const [selectedEnd, setSelectedEnd] = useState(stations[stations.length - 1]);
  const navigate = useNavigate();

  const handleStartChange = (event) => {
    setSelectedStart(event.target.value);
  };

  const handleEndChange = (event) => {
    setSelectedEnd(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const details = {
      userId,
      username,
      start: selectedStart,
      end: selectedEnd,
      price: calculatePrice(),
    };

    try {
      const response = await fetch('https://ticket-backend-j37d.onrender.com/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (response.ok) {
        const newTicket = await response.json();
        console.log('Ticket created successfully:', newTicket);
        navigate(`/ticket/${newTicket.ticketId}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to purchase ticket:', errorData);
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    }
  };

  const calculatePrice = () => {
    return prices[selectedStart][selectedEnd];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white bg-opacity-10 rounded-lg shadow-lg p-8 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Book a Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="startStation" className="block text-sm font-medium text-gray-200">
              Start Station
            </label>
            <select
              id="startStation"
              value={selectedStart}
              onChange={handleStartChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {stations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endStation" className="block text-sm font-medium text-gray-200">
              End Station
            </label>
            <select
              id="endStation"
              value={selectedEnd}
              onChange={handleEndChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {stations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-200">One-Time Ticket</div>
            <div className="text-lg font-bold text-white">₹{calculatePrice()}</div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105"
          >
            Buy Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketBooking;