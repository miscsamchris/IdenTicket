import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScannerPage from './components/ScannerPage';
import ValidationResult from './components/ValidationResult';
import MusicTest from './components/musictest';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ScannerPage />} />
          <Route path="/result" element={<ValidationResult />} />
          <Route path="/music-test" element={<MusicTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;