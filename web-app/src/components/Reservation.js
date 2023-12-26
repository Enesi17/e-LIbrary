import React, { useState } from "react";
import { Alert, Button, Card, CardHeader, Form, Row, Col } from 'react-bootstrap';
import firebase from "../firebase";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import TableMapView from "./TableMapView";

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
  const [showAlert, setShowAlert] = useState(false);
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const maxDate = new Date();
  maxDate.setDate(currentDate.getDate() + 5);
  const maxTime = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const calculateTimerDuration = () => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const periodInMinutes = (end - start) / (60 * 1000);
    setTimerDuration(periodInMinutes);
    return periodInMinutes;
  };

  const validateFormInputs = () => {
    // Add validation logic for each form input
    if (!floor || !table || !chair || !selectedDate || !startTime || !endTime) {
      return false;
    }
    return true;
  };

  const handleCheckIfFree = async (e) => {
    e.preventDefault();
    if(timerDuration <= 0){
      setShowAlert(true);
    }else{
      setShowAlert(false);
    }
    try {
      // Reset the state before checking chair availability
      setAvailability(false);
      setUnavailability(false);
  
      console.log('Checking if chair: ', chair, " in table: ", table, " of floor: ", floor, " is free...");
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);
      const cardRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}/cardID`);
      const snapshot1 = await chairRef.once('value');
      const snapshot2 = await cardRef.once('value');
      const status = snapshot1.val();
      const cardID = snapshot2.val();
  
      if (status === 'available') {
        console.log('Chair is available!');
        setAvailability(true);
      } else {
        console.log('Chair unavailable :( ');
        setUnavailability(true);
      }
    } catch (error) {
      console.error('Error checking chair availability: ', error.message);
    }
  
    calculateTimerDuration();
    console.log(timerDuration);
  };

  const handleReserve = async () => {
    
    try {
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}`);
      const snapshot = await chairRef.once('value');
      await chairRef.remove();
      const newChairData = { cardID:'0', status: 'reserved', timerDuration: timerDuration };
      await chairRef.set(newChairData);

      const reservationsRef = firebase.firestore().collection('reservations');
      const reservationData = {
        userId: currentUser.email,
        floor: floor,
        table: table,
        chair: chair,
        timerDuration: calculateTimerDuration(),
        reservationDate: selectedDate,
      };
      await reservationsRef.add(reservationData);

      setReservationDone(true);
      console.log("Reservation Done");
    } catch (error) {
      setReservationDone(false);
      console.error('Error reserving chair:', error.message);
    }
    setShowAlert(false);
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

  const handleSelectChair = ({ floor, table, chair }) => {
    setFloor(floor);
    setTable(table);
    setChair(chair);
    // Add other logic to update the form as needed
  };

  return (
    <div>
      {!currentUser && <Login />}
      {currentUser && !reservationDone && (
        <div>
        <h1 style={{ textAlign: 'center', margin: '20px' }}>RESERVATIONS</h1>
        <Row>
          <Col md={6}>
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
                    <Form.Group className="input-container">
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            min={currentDate.toISOString().split('T')[0]} // Set minimum date to today
                            max={maxDate.toISOString().split('T')[0]} // Set maximum date to 5 days from today
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="input-container">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={startTime}
                            min={(currentDate.getHours() + 2).toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0')}
                            max={maxTime.getHours().toString().padStart(2, '0') + ':' + maxTime.getMinutes().toString().padStart(2, '0')}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={endTime}
                            min={(currentDate.getHours() + 2).toString().padStart(2, '0') + ':' + currentDate.getMinutes().toString().padStart(2, '0')}
                            max={maxTime.getHours().toString().padStart(2, '0') + ':' + maxTime.getMinutes().toString().padStart(2, '0')}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Timer Time</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={timerDuration}
                          min="1"
                          max="4"
                          value={timerDuration}
                          required
                        />
                    </Form.Group>
                    <br />
                <Form.Group className='input-container'>
                  <Button type="button" onClick={handleCheckIfFree}> Check If Free?</Button>
                  <Button type="button" onClick={handleReset}> Reset values</Button>
                  <Button type="button" onClick={handleLogout}>Logout</Button>
                </Form.Group>
              </Form>
              {unavailability && <Alert className="info" variant="danger">This chair is not available. Try another chair</Alert>}
              {showAlert && <Alert className="info" variant="danger">Fill all the fields or check the timer interval</Alert>}
              {availability && <Alert className="info" variant="success">Selected chair is free.</Alert>}
            </Card.Body>
          </Card>
          {currentUser && !reservationDone && availability && (
              <div style={{ textAlign: 'center', margin: '10px', padding: '15px' }}>
                <br />
                <br />
                 <h3>Make Reservation for the selected seat</h3>
                 <br />
                  <Button type="submit" onClick={handleReserve}>Make Reservation</Button>
              </div>
        )}
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h4 style={{ textAlign: 'center', margin: '10px' }}>Table Map View</h4>
                </Card.Header>
                <Card.Body>
                  <TableMapView onSelectChair={handleSelectChair} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      
      {/* {reservationDone && (window.location.pathname == '/timer')} */}
      {reservationDone && setTimeout(function () {window.location.pathname = '/manageReservation';}, 100)}
    </div>
  );
}

export default Reservation;