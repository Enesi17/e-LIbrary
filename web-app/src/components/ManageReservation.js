import React, { useState, useEffect } from "react";
import { Card, Alert, Button } from "react-bootstrap";
import firebase from "../firebase"; // Import firebase
import { useAuth } from "../context/AuthContext"; // Import useAuth
import StartTimer from "./StartTimer";

const ManageReservation = () => {
  const { currentUser, logout } = useAuth(); // Assuming you have a useAuth hook

  // State and functions need to be defined
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [floor, setFloor] = useState(''); // Ensure floor, table, and chair are defined
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [startTimer, setStartTimer] = useState(false);
  const currentDate = new Date();
  const timestamp = currentDate.getTime();

  useEffect(() => {
    // Fetch reservation data when the component mounts
    const fetchReservationData = async () => {
      try {
        const reservationsRef = firebase.firestore().collection('reservations');
        const querySnapshot = await reservationsRef
          .where('userId', '==', currentUser.email)
          .get();

        if (!querySnapshot.empty) {
          const reservationDoc = querySnapshot.docs[0].data();
          setReservationData(reservationDoc);
          setFloor(reservationDoc.floor);
          setTable(reservationDoc.table);
          setChair(reservationDoc.chair);
        } else {
          setError('No reservation found.');
        }
      } catch (error) {
        setError('Error fetching reservation data: ' + error.message);
        console.error('Error fetching reservation data:', error.message);
      }
    };

    fetchReservationData();
  }, [currentUser.email]);

  const handleCancelReservation = async () => {
    try {
      // Update status and timerDuration in the Realtime Database
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}`);
      await chairRef.set({ status: 'available', timerDuration: 0 });

      // Delete the reservation document from Firestore
      const reservationsRef = firebase.firestore().collection('reservations');
      const querySnapshot = await reservationsRef
        .where('userId', '==', currentUser.email)
        .get();

      querySnapshot.forEach(async (doc) => {
        await reservationsRef.doc(doc.id).delete();
      });

      setReservationData(null);
      console.log("Reservation Canceled");
    } catch (error) {
      setError('Error canceling reservation: ' + error.message);
      console.error('Error canceling reservation:', error.message);
    }
  }

  const handleStartTimer = () => {
    setStartTimer(true);
    console.log("Timer started");
  };

  const handleBack = async (e) => {
    e.preventDefault();

    try {
      setTimeout(function () {window.location.pathname = '/reservation';}, 100);
    } catch (error) {
      setError("Failed to logout.");
      console.log(Error);
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {reservationData && (
            <div>
              <h2>Your Reservation</h2>
              <p>Floor: {reservationData.floor}</p>
              <p>Table: {reservationData.table}</p>
              <p>Chair: {reservationData.chair}</p>
              <p>Timer Duration: {reservationData.timerDuration} minutes</p>
              <p>Reservation Time: {timestamp} </p>


              <Button variant="danger" onClick={handleCancelReservation}>
                Cancel Reservation
              </Button>
              <Button variant="primary" onClick={handleStartTimer}>
                Start Timer
              </Button>
            </div>
          )}
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          {startTimer && reservationData && <StartTimer />}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageReservation;
