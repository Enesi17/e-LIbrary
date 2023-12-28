import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../firebase';
import { ref, getDatabase, remove } from 'firebase/database';

const Timer = ({ navigation }) => {
  const currentUser = getAuth(firebaseApp);
  const [seconds, setSeconds] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [timerEnd, setTimerEnd] = useState(false);
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const firestore = getFirestore(firebaseApp);
    const reservationsRef = collection(firestore, 'reservations');
    const q = query(reservationsRef, where('userId', '==', currentUser.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const reservationDoc = querySnapshot.docs[0].data();
      setReservationData(reservationDoc);
      setFloor(reservationDoc.floor);
      setTable(reservationDoc.table);
      setChair(reservationDoc.chair);
      setSeconds(reservationDoc.timerDuration)
      console.log('Timer Duration:', seconds);
    } else {
      setError('No reservation found.');
    }
  }
  
  useEffect(() => {
    let timerId;
    fetchData();
    if (!isPaused && seconds > 0) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    } else if (seconds === 0) {
      setTimerEnd(true);
      console.log('Timer ended!');
    }

    return () => clearInterval(timerId);
  }, [isPaused, seconds]);

  useEffect(() => {
    if (timerEnd) {
      handleCancelReservation();
      setTimeout(() => {
        navigation.navigate('Options');
      }, 100);
    }
  }, [timerEnd]);

  const handleCancelReservation = async () => {
    try {
      // Update status and timerDuration in the Realtime Database
      const db = getDatabase(firebaseApp);
      const chairRef = ref(
        db,
        `floors/floor${floor}/tables/table${table}/chairs/chair${chair}`
      );
      await set(chairRef({ cardID: "0", status: 'available', timerDuration: 0 }));

      const firestore = getFirestore(firebaseApp);
      const reservationsRef = collection(firestore, 'reservations');
      const q = query(reservationsRef, where('userId', '==', currentUser.email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

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
    <View>
      <Text>Time Remaining: {formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // Add styles for your card
  },
  timerText: {
    fontSize: 20,
  },
});

export default Timer;
