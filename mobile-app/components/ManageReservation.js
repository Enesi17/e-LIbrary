import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import firebaseApp from '../firebase';
import { getFirestore, ref, doc, setDoc, getDocs, query, where, collection, deleteDoc } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { ref as rtdbRef, set as rtdbSet } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import StartTimer from './StartTimer';


const ManageReservation = ({ navigation }) => {
  const { currentUser, logout } = getAuth(firebaseApp);
  const [error, setError] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [resDate, setResDate] = useState();
  const [confirmationMethod, setConfirmationMethod] = useState(''); // Added state for confirmation method

  const [startTimer, setStartTimer] = useState(false);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
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
          setResDate(reservationDoc.reservationDate);
        } else {
          setError('No reservation found.');
        }
      } catch (error) {
        setError('Error fetching reservation data: ' + error.message);
        console.error('Error fetching reservation data:', error.message);
      }
    };
    
    if (currentUser && currentUser.email) {
      fetchReservationData();
    }
  }, [currentUser]);

  const handleCancelReservation = async () => {
    try {
      const realtime = getDatabase(firebaseApp);
      const firestore = getFirestore(firebaseApp);
      const chairRefRTDB = rtdbRef(realtime, `floors/floor${floor}/tables/table${table}/chairs/chair${chair}`);
      await rtdbSet(chairRefRTDB, { cardID: '0', status: 'available', timerDuration: 0 });
      
      const reservationsRef = collection(firestore, 'reservations');
      const q = query(reservationsRef, where('userId', '==', currentUser.email), where('reservationDate', '==', resDate), where('chair', '==', chair));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      setReservationData(null);
      console.log('Reservation Canceled');
    } catch (error) {
      setError('Error canceling reservation: ' + error.message);
      console.error('Error canceling reservation:', error.message);
    }
  };
  
  const handleStartTimer = () => {
    const currentDateString = currentDate.toISOString().split('T')[0];
    console.log(resDate);
    console.log(formattedDate);
    if (resDate === currentDateString) {
      setStartTimer(true);
    } else {
      setError('Cannot start the timer. Reservation date does not match today.');
      console.log('Cannot start the timer. Reservation date does not match today.');
    }
  };
  
  const handleBack = async () => {
    try {
      navigation.navigate('Options');
    } catch (error) {
      setError('Failed to navigate back.');
      console.error('Failed to navigate back:', error);
    }
  };
  
  const handleConfirmationMethod = (method) => {
    // Update the confirmation method when a button is clicked
    setConfirmationMethod(method);
  };
  
  const renderConfirmationComponent = () => {
    // Render the selected confirmation component based on the chosen method
    switch (confirmationMethod) {
      case 'ConfirmCardID':
        navigation.navigate('ConfirmCardID');
        return;
        case 'ConfirmLogin':
          navigation.navigate('ConfirmLogin');
          return;
          case 'ConfirmSID':
            navigation.navigate('ConfirmSID');
            return;
            default:
              return null;
            }
          };
          
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Reservation</Text>
      {error && <Text>{error}</Text>}
      {console.log('data:', resDate)}
      {console.log('Curren User:',currentUser.email)}
      {reservationData && (
        <View>
          <Text>Floor: {reservationData.floor}</Text>
          <Text>Table: {reservationData.table}</Text>
          <Text>Chair: {reservationData.chair}</Text>
          <Text>Timer Duration: {reservationData.timerDuration} minutes</Text>
          <Button title="Cancel Reservation" onPress={handleCancelReservation} />
          <Button title="Start Timer" onPress={handleStartTimer} />
        </View>
      )}
      {/* Add the Picker for selecting confirmation method */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button title="ConfirmCardID" onPress={() => handleConfirmationMethod('ConfirmCardID')} />
        <Button title="ConfirmLogin" onPress={() => handleConfirmationMethod('ConfirmLogin')} />
        <Button title="ConfirmSID" onPress={() => handleConfirmationMethod('ConfirmSID')} />
      </View>
      {renderConfirmationComponent()}
      <Button title="Back" onPress={handleBack} />
      {startTimer && reservationData && <Timer navigation={navigation} />}

    </View>
  );
};

export default ManageReservation;
