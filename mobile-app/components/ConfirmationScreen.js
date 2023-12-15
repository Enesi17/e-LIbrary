import React, { useState } from 'react';
import { View, Text, Button, Picker } from 'react-native';
// import { useAuth } from '../context/AuthContext'; // Adjust this import based on your actual AuthContext

const ConfimrationScreen = ({ navigation }) => {

  //const { currentUser, logout } = useAuth();
  const [confirmReservation, setConfirmReservation] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [nfcConfirm, setNfcConfirm] = useState(false);
  const [reservationMethod, setReservationMethod] = useState('');

  const handleStartTimer = () => {
    try {
      setStartTimer(true);
    } catch (error) {
      console.error('Error starting timer:', error.message);
      setStartTimer(false);
    }
  };

  const handleSelectMethod = () => {
    try {
      setConfirmReservation(true);
      if (reservationMethod === 'email') {
        console.log('confirm with email');
        navigation.navigate('ConfirmLogin');
        setEmailConfirm(true);
        setNfcConfirm(false);
      } else if (reservationMethod === 'nfcReader') {
        console.log('nfcReader');
        navigation.navigate('NFCReader');
        setEmailConfirm(false);
        setNfcConfirm(true);
      } else {
        console.log('method not selected');
        setEmailConfirm(false);
        setNfcConfirm(false);
      }
    } catch (error) {
      console.error('Error starting timer:', error.message);
    }
  };

  const handleTimerEnd = () => {
    // Handle actions when the timer ends
    console.log('Timer ended!');
  };

  const handleReservationMethod = (value) => {
    setReservationMethod(value);
  };

  return (
    <View style={{ alignItems: 'center', margin: 20 }}>
      <Text>Timer</Text>

      
        <View style={{ alignItems: 'center' }}>
          <Text>Start your chair timer</Text>
          <Button title="Select Method" onPress={handleSelectMethod} />
        </View>

      { confirmReservation && (
        <View>
          <Text>Do you want to confirm with email or your student card?</Text>
          <View>
            <Picker
              selectedValue={reservationMethod}
              onValueChange={(value) => handleReservationMethod(value)}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="Email" value="email" />
              <Picker.Item label="NFC Reader" value="nfcReader" />
            </Picker>
            <Button title="Select" onPress={handleSelectMethod} />
          </View>
          {/* {emailConfirm && <ConfirmLogin />}
          {nfcConfirm && <NFCReader />} */}
        </View>
      )}
      {startTimer && <Timer duration={12000} onTimerEnd={handleTimerEnd} />}
    </View>
  );
};

export default ConfimrationScreen;