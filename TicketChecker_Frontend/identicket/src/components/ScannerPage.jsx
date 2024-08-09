import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';

function ScannerPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result && result.length > 0) {
      const scannedData = result[0].rawValue;
      navigate('/result', { state: { ticketData: scannedData } });
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code. Please try again.');
    console.error(err);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Scan Ticket</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          scanDelay={500}
          components={{
            audio: true,
            torch: true,
            finder: true,
          }}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="text-center mt-4 text-gray-600">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
}

export default ScannerPage;