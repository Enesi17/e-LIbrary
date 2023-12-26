import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import firebase from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmLogin from "./ConfirmLogin";
import ConfirmCardID from "./ConfirmCardID";
import ConfirmSID from "./ConfirmSID";
import Timer from "./Timer"

const StartTimer = () => {
  const { currentUser, logout } = useAuth();
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [studentIDConfirm, setStudentIDConfirm] = useState(false);
  const [cardIDConfirim, setCardIDConfirm] = useState(false);
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
        setStudentIDConfirm(false);
        setCardIDConfirm(false);
      } else if (reservationMethod === 'studentID') {
        console.log('studentID');
        setEmailConfirm(false);
        setStudentIDConfirm(true);
        setCardIDConfirm(false);
      } else if(reservationMethod === 'cardID'){
        console.log('cardID');
        setEmailConfirm(false);
        setStudentIDConfirm(false);
        setCardIDConfirm(true);
      }else{
        console.log('method not selected');
        setEmailConfirm(false);
        setStudentIDConfirm(false);
        setCardIDConfirm(false);
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
                  <option value="studentID">Student ID</option>
                  <option value="cardID">Read Card</option>
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
          {studentIDConfirm && <ConfirmSID />}
          {cardIDConfirim && <ConfirmCardID />}
        </div>
      )}
      {startTimer && <Timer duration={timerDuration} onTimerEnd={handleTimerEnd} />}
      {timerEnd && setTimeout(function () {window.location.pathname = '/reservation';}, 1000)}
    </div>
  );
};

export default StartTimer;
