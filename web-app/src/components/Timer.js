import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import firebase from '../firebase'; // Import firebase
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Timer = () => {
  const [seconds, setSeconds] = useState();
  const [isPaused, setIsPaused] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const { currentUser } = useAuth();
  const [timerEnd, setTimerEnd] = useState(false);
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [timerDuration, setTimerDuration] = useState(0);

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
  }, [isPaused, seconds, currentUser]);

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
        setTimerDuration(reservationDoc.timerDuration);
        setSeconds(reservationDoc.timerDuration * 60);
      } else {
        setError('No reservation found.');
      }
    } catch (error) {
      setError('Error fetching reservation data: ' + error.message);
      console.error('Error fetching reservation data:', error.message);
    }
  };

  useEffect(() => {
    // Fetch reservation data when the component mounts
    console.log(seconds);
    fetchReservationData();
  }, [currentUser.email]);

  

  const handleCancelReservation = async () => {
    try {
      // Update status and timerDuration in the Realtime Database
      const chairRef = firebase.database().ref(`floors/floor${floor}/tables/table${table}/chairs/chair${chair}`);
      await chairRef.set({ cardID:'0', status: 'available', timerDuration: 0 });

      // Delete the reservation document from Firestore
      const reservationsRef = firebase.firestore().collection('reservations');
      const querySnapshot = await reservationsRef
        .where('userId', '==', currentUser.email)
        .get();

      querySnapshot.forEach(async (doc) => {
        await reservationsRef.doc(doc.id).delete();
      });

      setReservationData(null);
      console.log('Reservation Canceled');
    } catch (error) {
      setError('Error canceling reservation: ' + error.message);
      console.error('Error canceling reservation:', error.message);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div>
      <Card className='login'>
        <h2>Time Remaining: {formatTime(seconds)}</h2>
        {timerEnd && handleCancelReservation() && setTimeout(function () {window.location.pathname = '/reservation';}, 1000)}
      </Card>
    </div>
  );
};

export default Timer;
