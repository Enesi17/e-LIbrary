import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import firebase from "../firebase";
import { useAuth } from "../context/AuthContext";
import ConfirmLogin from "./ConfirmLogin"
import NFCReader from "./NFCReader";

const Timer = () => {

    const { currentUser, logout } = useAuth();
    const [confirmReservation, setConfirmReservation] = useState(false);
    const [emailConfirm, setEmailConfirm] = useState(false);
    const [nfcConfirm, setNfcConfirm] = useState(false);
    const [reservationMethod, setReservationMethod] = useState('');
    const [Error, setError] = useState("error");

    const handleStartTimer = async () => {
        try {
          setConfirmReservation(true);
          if (reservationMethod === 'email') {
            console.log('confirm with eamil');
            setEmailConfirm(true);
            setNfcConfirm(false);
          } else if (reservationMethod === 'nfcReader') {
            console.log('nfcReader');
            setEmailConfirm(false);
            setNfcConfirm(true);
          } else{
            console.log('method not written');
            setEmailConfirm(false);
            setNfcConfirm(false);
          }
          console.log('Chair reserved successfully!');
        } catch (error) {
          console.error('Error starting timer:', error.message);
        }
      }
    

    const handleReservationMethod = (e) => {
        setReservationMethod(e.target.value);
    };


    return ( 
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>
                Timer
            </h1>

            {currentUser && (
        <div style={{ textAlign: 'center' }}>
          <h3>Start your chair timer</h3>
          <Button type="submit" onClick={handleStartTimer}>
              Start Timer
          </Button>
        </div>
      )}

      { currentUser && confirmReservation && (
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
          <option value="nfcReader">NFC Reader</option>
        </Form.Control>
      </Form.Group>
            <Button type="button" onClick={handleStartTimer}>Start Timer</Button>
            </Form>
          </div>
          {emailConfirm && <ConfirmLogin />}
          {nfcConfirm && <NFCReader />}
        </div>
      )}
        </div>
     );
}
 
export default Timer;