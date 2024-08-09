import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Ticket = () => {
  const [ticket, setTicket] = useState(null);
  const [otp, setOtp] = useState('');
  const [timestamp, setTimestamp] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      const intervalId = setInterval(() => {
        updateOtpAndTimestamp();
      }, 3000);

      updateOtpAndTimestamp();

      return () => clearInterval(intervalId);
    }
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`https://ticket-backend-j37d.onrender.com/ticket/${id}`);
      if (response.ok) {
        const ticketData = await response.json();
        console.log(ticketData);
        setTicket(ticketData);
      } else {
        console.error('Failed to fetch ticket');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  const generateOtp = (ticketId, timestamp) => {
    console.log(`Generating OTP for ticketId: ${ticketId}, timestamp: ${timestamp}`);
    let tId = parseInt(ticketId);
    let modTimestamp = parseInt(timestamp) % 900;
    console.log(modTimestamp);
    timestamp = timestamp - modTimestamp;
    console.log(timestamp);
    let tStamp = parseInt(timestamp/ 900);
    console.log(tStamp);
    let combined = tId + tStamp;
    console.log(combined);
    let hashValue = 5381;
    console.log(hashValue);
    for (let i = 0; i < 1; i++) {
      console.log("initial",i,"value",hashValue);
      let hash_value_multiplier =(hashValue * 33) ;
      hashValue = (hash_value_multiplier+ combined);
      let power=10**8;
      hashValue = hashValue % power;
      console.log("iteration",i,"value",hashValue);
    }
    let finalHash=hashValue * 999;
    console.log(finalHash);
    let otp = finalHash % 1000000;
    console.log(`Generated OTP: ${otp.toString().padStart(6, '0')}`);
    return otp.toString().padStart(6, '0');
  };

  const isOtpValid = (generatedTime, currentTime) => {
    const isValid = currentTime - generatedTime < 300;
    console.log(`OTP validity check: ${isValid ? 'Valid' : 'Invalid'} (${currentTime - generatedTime} seconds elapsed)`);
    return isValid;
  };

  const updateOtpAndTimestamp = () => {
    if (ticket) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      console.log(`Current timestamp: ${currentTimestamp}, Last update: ${timestamp}`);
      if (!timestamp || !isOtpValid(timestamp, currentTimestamp)) {
        setTimestamp(currentTimestamp);
        const newOtp = generateOtp(ticket.ticketId, currentTimestamp);
        setOtp(newOtp);
        console.log('OTP updated');
      } else {
        console.log('OTP still valid, no update needed');
      }
    }
  };

  const formatTimestamp = (epochTimestamp) => {
    const date = new Date(epochTimestamp);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const ticketData = JSON.stringify({
    ...ticket,
    otp,
    username: ticket.username,
    computeId: ticket.computeId,
    storeId: ticket.storeId,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Your Ticket</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 space-y-2">
            <p className="text-gray-800"><span className="font-semibold">From:</span> {ticket.start}</p>
            <p className="text-gray-800"><span className="font-semibold">To:</span> {ticket.end}</p>
            <p className="text-gray-800"><span className="font-semibold">Type:</span> {ticket.dailyPass ? 'Daily Pass' : 'Single Journey'}</p>
            <p className="text-gray-800"><span className="font-semibold">Price:</span> ₹{ticket.price}</p>
            <p className="text-gray-800"><span className="font-semibold">Status:</span> 
              <span className={ticket.validationStatus ? 'text-green-600' : 'text-red-600'}>
                {ticket.validationStatus ? 'Validated' : 'Not Validated'}
              </span>
            </p>
            <p className="text-gray-800"><span className="font-semibold">Date & Time:</span> {formatTimestamp(ticket.createdAt)}</p>
          </div>
          <div className="flex justify-center mt-6">
            <QRCode value={ticketData} size={200} level="H" renderAs="svg" />
          </div>
          {ticket.collectionAddress && (
            <div className="mt-4">
              <button
                onClick={() => window.open(`https://explorer.aptoslabs.com/account/${ticket.collectionAddress}?network=devnet`, '_blank')}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <img src="/Aptos.png" alt="Aptos Logo" className="w-5 h-5 mr-2" />
                View NFT Collection
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-300 text-center mt-4">
          Please show this QR code to the conductor when requested. The OTP refreshes every 5 minutes.
        </p>
      </div>
    </div>
  );
};

export default Ticket;