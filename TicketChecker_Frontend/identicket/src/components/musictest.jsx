import React, { useState } from 'react';

const MusicTest = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState('It will take 32 minutes to reach your destination.');

  const generateAndPlayAudio = async () => {
    try {
      const response = await fetch('https://ticket-backend-j37d.onrender.com/generate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate TTS');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white bg-opacity-10 p-8 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">TTS Test</h2>
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={generateAndPlayAudio}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105"
        >
          Generate and Play Audio
        </button>
        {audioUrl && (
          <audio controls className="mt-4 w-full">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default MusicTest;