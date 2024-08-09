import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`https://ticket-backend-j37d.onrender.com/tickets?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-6">My Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Link to={`/ticket/${ticket.ticketId}`} key={ticket.ticketId} className="block">
            <div className="bg-white bg-opacity-10 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-2 text-white">{ticket.start} to {ticket.end}</h3>
              <p className="text-gray-300">Type: {ticket.dailyPass ? 'Daily Pass' : 'Single Journey'}</p>
              <p className="text-gray-300">Price: ₹{ticket.price}</p>
              <p className="text-gray-300">Status: 
                <span className={ticket.validationStatus ? 'text-green-400' : 'text-red-400'}>
                  {ticket.validationStatus ? ' Validated' : ' Not Validated'}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TicketList;