import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import LandingPage from './components/LandingPage';
import TicketBooking from './components/TicketBooking';
import Ticket from './components/Ticket';
import InstallPWA from './components/InstallPWA';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import PassList from './components/PassList';
import Profile from './components/Profile';
import Pass from './components/Pass';
import AadhaarVerification from './components/AadhaarVerification';
import PassBooking from './components/PassBooking'; // New import for PassBooking component
import './index.css';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <AnonAadhaarProvider _useTestAadhaar={true}>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/aadhaar-verification" element={<AadhaarVerification />} />
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="ticket-booking" element={<TicketBooking />} />
                  <Route path="pass-booking" element={<PassBooking />} />
                  <Route path="tickets" element={<TicketList />} />
                  <Route path="passes" element={<PassList />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/ticket/:id" element={<Ticket />} />
                <Route path="/pass/:id" element={<Pass />} />
              </Routes>
              <InstallPWA />
            </div>
          </Router>
        </AnonAadhaarProvider>
      ) : null}
    </>
  );
}

export default App;