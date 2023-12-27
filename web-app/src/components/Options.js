import React, { useState } from 'react';
import { Button } from 'react-bootstrap'; // Correct import statement
import { useAuth } from "../context/AuthContext";
import Login from './Login';

const Options = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');

  const handleReservationClick = () => {
    console.log('Making a reservation');
    window.location.pathname = '/reservation';
  };

  const handleStartTimerClick = () => {
    console.log('Starting timer');
    window.location.pathname = '/manageReservation';
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.pathname = '/login'
    } catch (error) {
      setError("Failed to logout.");
      console.error(error); 
    }
  };

  return (
    <div>
       {currentUser && 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
             <br />
        <h2>Libarary Menagment System</h2>
        <br />
        <br />
      <Button onClick={handleReservationClick}>Make a Reservation</Button>
      <br />
      <br />
      <Button onClick={handleStartTimerClick}>Start Timer</Button>
      <br />
      <Button onClick={handleLogoutClick}>Log out</Button>
      <br />
        </div>
       }
       {!currentUser && <Login />}
    </div>
  );
};

export default Options;

