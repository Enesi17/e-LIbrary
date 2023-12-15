import React, { useState } from "react";
import { Alert, Button, Card, CardHeader, Form } from 'react-bootstrap';
import firebase from "../firebase";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";


// import QRCodeGenerator from "./QRCodeGenerator";
// import TimerComponent from "./Timer"; // Import your Timer component here
// import NFCReader from "./NFCReader";

const Reservation = () => {
  const { currentUser, logout } = useAuth();
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [availability, setAvailability] = useState(false);
  const [unavailability, setUnavailability] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [Error, setError] = useState("error");

  const handleCheckIfFree = async (e) => {
    e.preventDefault();

    try {
      console.log('Checking if chair: ', chair, " in table: ", table, " of floor: ", floor, " is free...");
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);
      const snapshot = await chairRef.once('value');
      const status = snapshot.val();

      if (status === 'available') {
        console.log('Chair is available!');
        setAvailability(true);
        setUnavailability(false);
      } else {
        console.log('Chair unavailable :( ');
        setAvailability(false);
        setUnavailability(true);
      }
    } catch (error) {
      console.error('Error checking chair availability: ', error.message);
    }
  }

  const handleReserve = async () => {
    try {
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);
      const snapshot = await chairRef.once('value');
      await chairRef.remove();
      const newChairData = { status: 'reserved', timerDuration: timerDuration };
      await chairRef.set(newChairData);
      setReservationDone(true);
      console.log("Reservation Done");
    } catch (error) {
      setReservationDone(false);
      console.error('Error reserving chair:', error.message);
    }
  }

  const handleReset = async () => {
    window.location.reload();
  }

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await logout();
    } catch (error) {
      setError("Failed to logout.");
      console.log(Error);
    }
  }


  return (
    <div>
      {!currentUser && <Login />}
      {currentUser && !reservationDone && (
        <div>
          <h1 style={{ textAlign: 'center', margin: '20px' }}>RESERVATIONS</h1>
          <Card className="login-container">
            <CardHeader>
              <h4 style={{ textAlign: 'center', margin: '10px' }}>Reserve a chair for yourself</h4>
            </CardHeader>
            <Card.Body>
                <Form>
                    <Form.Group className="input-container">
                        <Form.Label>Floor</Form.Label>
                        <Form.Control   
                            type="number"
                            placeholder="Choos floor"
                            min="0"
                            max="2"
                            value={floor}
                            onChange={(e)=> setFloor(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Choose Table </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Choose table"
                            min="1"
                            max="10"
                            value={table}
                            onChange={(e) => setTable(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Choose Chair</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Choose chair"
                            min="1"
                            max="4"
                            value={chair}
                            onChange={(e) => setChair(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Set Timer</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Set Timer (min)"
                            min="1"
                            max="4"
                            value={timerDuration}
                            onChange={(e) => setTimerDuration(e.target.value)}
                            required
                        />
                    </Form.Group>
                <Form.Group className='input-container'>
                  <Button type="button" onClick={handleCheckIfFree}> Check If Free?</Button>
                  <Button type="button" onClick={handleReset}> Reset values</Button>
                  <Button type="button" onClick={handleLogout}>Logout</Button>
                </Form.Group>
              </Form>
              {unavailability && <Alert className="info" variant="danger">This chair is not available. Try another chair</Alert>}
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </div>
      )}

      {currentUser && !reservationDone && availability && (
        <div style={{ textAlign: 'center' }}>
          <br />
          <br />
          <h3>Make Reservation for the selected seat</h3>
          <Button type="submit" onClick={handleReserve}>
            Make Reservation
          </Button>
        </div>
        )}
      {/* {reservationDone && (window.location.pathname == '/timer')} */}
      {reservationDone && setTimeout(function () {window.location.pathname = '/timer';}, 100)}
    </div>
  );
}

export default Reservation;