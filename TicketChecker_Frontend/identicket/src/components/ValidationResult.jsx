import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function ValidationResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketData = location.state?.ticketData;
  const [validationStatus, setValidationStatus] = useState(null);
  const [eta, setEta] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const stations = ['Margao', 'Vasco da Gama', 'Ponda', 'Mapusa'];

  useEffect(() => {
    if (ticketData) {
      try {
        const parsed = JSON.parse(ticketData);
        console.log('Parsed ticket data:', parsed);
        setParsedData(parsed);
        validateTicket(parsed);
      } catch (error) {
        console.error('Error parsing ticket data:', error);
      }
    }
  }, [ticketData]);

  useEffect(() => {
    if (validationStatus !== null) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [validationStatus, navigate]);

  const validateTicket = async (data) => {
    console.log('Validating ticket...');
    try {
      const response = await fetch('https://637b-103-216-234-205.ngrok-free.app/validate_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          party_ids_to_store_ids: data.storeId,
          program_id: data.computeId,
          seed: data.username,
          otp: data.otp,
        }),
      });

      const { data: responseData } = await response.json();
      console.log('Validation response:', responseData);
      if (responseData.isvalid === 1) {
        await fetch(`https://ticket-backend-j37d.onrender.com/ticket/${data.ticketId}/validate`, {
          method: 'POST',
        });
        setValidationStatus(true);
        console.log('Ticket validated successfully');
        predictEta(data);
      } else {
        setValidationStatus(false);
        console.log('Ticket validation failed');
      }
    } catch (error) {
      console.error('Error validating ticket:', error);
      setValidationStatus(false);
    }
  };

  const predictEta = async (data) => {
    console.log('Predicting ETA...');
    try {
      const fromIndex = stations.indexOf(data.start) + 1;
      const toIndex = stations.indexOf(data.end) + 1;

      const response = await fetch('https://637b-103-216-234-205.ngrok-free.app/predict_eta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromIndex,
          to: toIndex,
          day_of_the_week: 1
        }),
      });

      const responseData = await response.json();
      console.log('ETA prediction response:', responseData);
      if (responseData.data) {
        setEta(responseData.data);
        generateAndPlayAudio(responseData.data);
      } else {
        console.error('Unexpected ETA response format');
      }
    } catch (error) {
      console.error('Error predicting ETA:', error);
    }
  };

  const generateAndPlayAudio = async (etaMessage) => {
    try {
      const response = await fetch('https://ticket-backend-j37d.onrender.com/generate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: etaMessage }),
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => console.error('Error playing audio:', error));
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioUrl]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!parsedData) {
    return <p className="text-red-500">Invalid ticket data</p>;
  }

  return (
    <div className="max-w-md mx-auto text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Ticket Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 text-left">
        {validationStatus === true && (
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <DataField label="From" value={parsedData.start} />
          <DataField label="To" value={parsedData.end} />
          <DataField label="Ticket Type" value={parsedData.dailyPass ? 'Daily Pass' : 'Single Journey'} />
          <DataField label="Price" value={`₹${parsedData.price}`} />
          <DataField
            label="Validation Status"
            value={validationStatus === true ? 'Valid' : validationStatus === false ? 'Invalid' : 'Validating...'}
            className={`font-semibold ${
              validationStatus === true
                ? 'text-green-600'
                : validationStatus === false
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          />
          <DataField label="OTP" value={parsedData.otp} />
          <DataField label="Timestamp" value={formatTimestamp(parsedData.timestamp)} />
          <DataField
            label="Estimated Travel Time"
            value={eta || 'Calculating...'}
            className="font-semibold"
          />
        </div>
      </div>
      <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
        Scan Another Ticket
      </Link>
    </div>
  );
}

function DataField({ label, value, className }) {
  return (
    <div className="mb-2">
      <p className="font-semibold text-gray-600">{label}</p>
      <p className={`text-black ${className}`}>{value}</p>
    </div>
  );
}

export default ValidationResult;