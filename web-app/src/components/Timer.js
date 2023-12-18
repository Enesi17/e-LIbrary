// Timer.js
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import firebase from '../firebase'; // Import firebase
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Timer = ({ duration }) => {
  const [seconds, setSeconds] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const { currentUser } = useAuth();
  const [timerEnd, setTimerEnd] = useState(false);
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    let timerId;

    if (!isPaused && seconds > 0) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    } else if (seconds === 0) {
      setTimerEnd(true);
      console.log('Timer ended!');
      setStartTimer(false);
    }

    return () => clearInterval(timerId);
  }, [isPaused, seconds, duration, currentUser]);

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


  const handleStartTimer = async () => {
    try {
      const reservationsRef = firebase.firestore().collection('reservations');
      const querySnapshot = await reservationsRef
        .where('userId', '==', currentUser.email)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const reservationData = querySnapshot.docs[0].data();
        const reservationFloor = reservationData.floor;
        const reservationTable = reservationData.table;
        const reservationChair = reservationData.chair;

        setFloor(reservationFloor);
        setTable(reservationTable);
        setChair(reservationChair);

        const reservationDuration = reservationData.timerDuration || 0;
        setSeconds(reservationDuration);
        setStartTimer(true);
      } else {
        console.log('No reservation found for the current user.');
      }
    } catch (error) {
      console.error('Error starting timer:', error.message);
      setStartTimer(false);
    }
  };

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
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsPaused(true);
    setSeconds(duration * 60); // Reset to the original duration in seconds
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div>
      
        {!startTimer && <Button onClick={handleStartTimer}>Start</Button>}
          {startTimer && <h2>Time Remaining: {formatTime(seconds)}</h2>}
        <Button onClick={handlePause}>{isPaused ? 'Resume' : 'Pause'}</Button>
        <Button onClick={handleReset}>Reset</Button>
      {timerEnd && handleCancelReservation() && setTimeout(function () {window.location.pathname = '/reservation';}, 1000)}
    </div>
  );
};

export default Timer;
