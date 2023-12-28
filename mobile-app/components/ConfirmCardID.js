import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import rfidImg from '../img/rfid.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, where, getDocs } from 'firebase/firestore';
import { getDatabase, ref as rtdbRef, get } from 'firebase/database';

const ConfirmCardID = ({ navigation }) => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCardID, setCurrentCardID] = useState(0);
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [readCardID, setReadCardID] = useState('');
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchReservationData = async () => {
    try {
      const firestore = getFirestore();
      const reservationsRef = collection(firestore, 'reservations');
      const querySnapshot = await getDocs(where(reservationsRef, 'userId', '==', currentUser.email));

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

  const checkChairStatus = async () => {
    try {
      const chairRef = rtdbRef(getDatabase(), `floors/floor${floor}/tables/table${table}/chairs/chair${chair}/cardID`);
      const snapshot = await get(chairRef);
      const cardID = snapshot.val();
      setReadCardID(cardID);
      console.log(readCardID);
    } catch (error) {
      console.error('Error checking chair status: ', error.message);
    }
  };

  const handleConfirmationClick = async () => {
    await fetchReservationData();
    await checkChairStatus();

    if (currentCardID === readCardID) {
      setConfirmationSuccess(true);
    } else {
      setConfirmationSuccess(false);
      console.log('Error: Card ID does not match.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firestore = getFirestore();
        const usersRef = collection(firestore, 'users');
        const userSnapshot = await getDocs(where(usersRef, 'email', '==', currentUser.email));

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setCurrentCardID(userData.cardID);
        } else {
          setError('No user found with the provided email.');
        }
      } catch (error) {
        setError('Error fetching user data: ' + error.message);
        console.error('Error fetching user data:', error.message);
      }
    };

    if (currentUser && currentUser.email) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (confirmationSuccess) {
      navigation.navigate('Timer');
    } else {
      console.log('Error reading cardID');
    }
  }, [confirmationSuccess, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Read Card to Start Timer</Text>
      <Image source={rfidImg} style={{ width: 100, height: 100 }} />
      <Text>Please read your card to the RFID reader in your table, and click 'Confirmation'</Text>
      <Button title="Confirm" onPress={handleConfirmationClick} />
    </View>
  );
};

export default ConfirmCardID;

