import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, get, set } from 'firebase/database';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const Reservation = ({navigation}) => {

  const { currentUser, logout } = getAuth();
  const [floor, setFloor] = useState('');
  const [table, setTable] = useState('');
  const [chair, setChair] = useState('');
  const [timerDuration, setTimerDuration] = useState('');
  const [availability, setAvailability] = useState(false);
  const [unavailability, setUnavailability] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [ showAlert, setShowAlert] = useState(false);

  const calculateTimerDuration = () => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const periodInMinutes = (end - start) / (60 * 1000);
    setTimerDuration(periodInMinutes);
    return periodInMinutes;
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };
  const handleStartTimeChange = (event, time, setTime, setShowTimePicker) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setStartTime(time);
    }
  };
  const handleEndTimeChange = (event, time, setTime, setShowTimePicker) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setEndTime(time);
    }
  };
  
  useEffect(() => {
    // Additional side effect logic can be added here
  }, []); // Empty dependency array means this effect runs once on mount

  const navigateToReservationManager= () => {
    if (floor && table && chair) {
      navigation.navigate('TimerScreen', { floor, table, chair });
    } else {
      console.error('Invalid floor, table, or chair values');
    }
  };

  const handleCheckIfFree = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const database = getDatabase(firebaseApp);
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
    try {
      const auth = getAuth(firebaseApp);
      const database = getDatabase(firebaseApp);
      const firestore = getFirestore(firebaseApp);
  
      const chairRef = ref(database, `floors/floor${floor}/tables/table${table}/chairs/chair${chair}`);
      const snapshot = await get(chairRef);
      await set(chairRef, null);
      const newChairData = { cardID: '0', status: 'reserved', timerDuration: timerDuration };
      await set(ref(database, `floors/floor${floor}/tables/table${table}/chairs/chair${chair}`), newChairData);
  
      const reservationsRef = collection(firestore, 'reservations');
      const reservationData = {
        userId: currentUser.email,
        floor: floor,
        table: table,
        chair: chair,
        timerDuration: timerDuration,
        reservationDate: selectedDate.toISOString().split('T')[0],
      };
      await addDoc(reservationsRef, reservationData);
  
      setReservationDone(true);
      navigation.navigate('ManageReservation')
      console.log("Reservation Done");
    } catch (error) {
      setReservationDone(false);
      console.error('Error reserving chair:', error.message);
    }
    setShowAlert(false);
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!currentUser && <Text>Login required</Text>}
      {currentUser && !reservationDone && (
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
                <Button
                    title={`Select Date: ${selectedDate.toISOString().split('T')[0]}`}
                    onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        minimumDate={new Date()}
                        maximumDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)} // 5 days from today
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Start Time Picker */}
                <Button
  title={`Select Start Time: ${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`}
  onPress={() => setShowStartTimePicker(true)}
/>
{showStartTimePicker && (
  <DateTimePicker
    value={startTime}
    mode="time"
    display="default"
    onChange={(event, time) => handleStartTimeChange(event, time, setStartTime, setShowStartTimePicker)}
  />
)}

<Button
  title={`Select End Time: ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`}
  onPress={() => setShowEndTimePicker(true)}
/>
{showEndTimePicker && (
  <DateTimePicker
    value={endTime}
    mode="time"
    display="default"
    onChange={(event, time) => handleEndTimeChange(event, time, setEndTime, setShowEndTimePicker)}
  />
)}
              <TextInput
                style={styles.input}
                placeholder="Timer Duration (min)"
                value={timerDuration}
                onChangeText={(text) => setTimerDuration(text)}
              />
              <Button title="Check If Free?" onPress={handleCheckIfFree} />
              <Button title="Reset values" onPress={handleReset} />
              {unavailability && (
                <View style={styles.centeredView}>
                  <Text>This chair is not available.</Text>
                  <Text>Try another chair</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {!reservationDone && availability && (
        <View style={styles.centeredView}>
          <Text style={styles.reservationText}>Selected seat is free</Text>
          <Text style={styles.reservationText}>Make Reservation for the selected seat</Text>
          <Button title="Make Reservation" onPress={handleReserve} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  reservationText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Reservation;
