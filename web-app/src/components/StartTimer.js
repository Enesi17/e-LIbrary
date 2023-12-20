import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import firebase from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmLogin from "./ConfirmLogin";
import ConfirmSID from "./ConfirmSID";
import Timer from "./Timer"

const StartTimer = () => {
  const { currentUser, logout } = useAuth();
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [nfcConfirm, setNfcConfirm] = useState(false);
  const [reservationMethod, setReservationMethod] = useState('');
  const [timerDuration, setTimerDuration] = useState(0); // Added state to store timer duration
  const [Error, setError] = useState("error");
  const [timerEnd, setTimerEnd] = useState(false);

  const handleSelectMethod = async () => {
    try {
      setConfirmReservation(true);
      if (reservationMethod === 'email') {
        console.log('confirm with email');
        setEmailConfirm(true);
        setNfcConfirm(false);
      } else if (reservationMethod === 'nfcReader') {
        console.log('nfcReader');
        setEmailConfirm(false);
        setNfcConfirm(true);
      } else {
        console.log('method not selected');
        setEmailConfirm(false);
        setNfcConfirm(false);
      }
    } catch (error) {
      console.error('Error starting timer:', error.message);
    }
  };

  const handleTimerEnd = () => {
    setTimerEnd(true);
    console.log('Timer ended!');
  };

  const handleReservationMethod = (e) => {
    setReservationMethod(e.target.value);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Timer</h1>

      {currentUser && (
        <div style={{ textAlign: 'center' }}>
          <h3>Start your chair timer</h3>
          <Button type="submit" onClick={handleSelectMethod}>
            Select Method
          </Button>
        </div>
      )}

      {currentUser && confirmReservation && (
        <div>
          <br />
          <br />
          <h4>Do you want to confirm with email or your student card?</h4>
          <div>
            <Form>
              <Form.Group>
                <Form.Label>Select Reservation Method:</Form.Label>
                <Form.Control as="select" value={reservationMethod} onChange={handleReservationMethod}>
                  <option value="">Select...</option>
                  <option value="email">Email</option>
                  <option value="nfcReader">Student ID</option>
                </Form.Control>
              </Form.Group>
              <br />
              <Button type="button" onClick={handleSelectMethod}>
                Select
              </Button>
            </Form>
            <br />
          </div>
          {emailConfirm && <ConfirmLogin />}
          {nfcConfirm && <ConfirmSID />}
        </div>
      )}
      {startTimer && <Timer duration={timerDuration} onTimerEnd={handleTimerEnd} />}
      {timerEnd && setTimeout(function () {window.location.pathname = '/reservation';}, 1000)}
    </div>
  );
};

export default StartTimer;
