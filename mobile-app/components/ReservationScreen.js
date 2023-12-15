import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, get, remove, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ReservationScreen = ({ navigation }) => {
//   const { currentUser, logout } = useAuth();
    const navigation = useNavigation();
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [timerDuration, setTimerDuration] = useState('');
  const [availability, setAvailability] = useState(false);
  const [unavailability, setUnavailability] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);
  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };
  const navigateToTimerScreen = () => {
    // Check if floor, table, and chair are valid (add your validation logic)
    if (floor && table && chair) {
      navigation.navigate('TimerScreen', { floor, table, chair });
    } else {
      // Handle validation error
      console.error('Invalid floor, table, or chair values');
    }
  };
  

  const handleCheckIfFree = async () => {
    try {
      const auth = getAuth(firebaseApp);
      console.log('Checking if chair: ', chair, ' in table: ', table, ' of floor: ', floor, ' is free...');
      const database = getDatabase();
      const chairRef = ref(database, `floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);
      const snapshot = await get(chairRef);
      const status = snapshot.val();
  
      console.log('Status:', status);
  
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
  };

  const handleReserve = async () => {
    navigation.navigate('ConfirmationScreen');
  };

  const handleReset = () => {
    setFloor('');
    setTable('');
    setChair('');
    setTimerDuration('');
    setAvailability(false);
    setUnavailability(false);
    setReservationDone(false);
  };

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error('Failed to logout:', error.message);
//     }
//   };

  return (
    <View style={styles.container}>
      {/* {!currentUser && <Text>Login required</Text>} */}
      {/* {currentUser && !reservationDone && ( */}
        <View>
          <Text style={styles.title}>RESERVATIONS</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Reserve a chair for yourself</Text>
            <View style={styles.cardBody}>
              <TextInput
                style={styles.input}
                placeholder="Floor"
                value={floor}
                onChangeText={(text) => setFloor(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Table"
                value={table}
                onChangeText={(text) => setTable(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Chair"
                value={chair}
                onChangeText={(text) => setChair(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Timer Duration (min)"
                value={timerDuration}
                onChangeText={(text) => setTimerDuration(text)}
              />
              <Button title="Check If Free?" onPress={handleCheckIfFree} />
              <Button title="Reset values" onPress={handleReset} />
              {/* <Button title="Logout" onPress={handleLogout} />*/}
              {unavailability && (
                <View style={styles.centeredView}>
                    <Text>This chair is not available.</Text>
                    <Text>Try another chair</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      {/* )} */}

       { !reservationDone && availability && (
        <View style={styles.centeredView}>
            <Text style={styles.reservationText}>Selected seat is free</Text>
          <Text style={styles.reservationText}>Make Reservation for the selected seat</Text>
          <Button title="Make Reservation" onPress={handleReserve} />
        </View>
      )}

      {reservationDone && (
        <Text>Reservation done. Redirecting...</Text>
        // Consider using navigation to navigate to the next screen here
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  card: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  cardBody: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  alert: {
    marginTop: 10,
  },
  centeredView: {
    alignItems: 'center',
    marginTop: 20,
  },
  reservationText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ReservationScreen;