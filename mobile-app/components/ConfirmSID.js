import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ConfirmSID = ({ navigation }) => {
  const auth = getAuth();
  const [studentID, setStudentID] = useState(null);
  const [enteredStudentID, setEnteredStudentID] = useState('');
  const [wrongID, setWrongID] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentID = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(getFirestore(), 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setStudentID(userData.studentID);
          } else {
            console.log('User document not found in Firestore');
          }
        } else {
          console.log('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching student ID:', error.message);
      }
    };

    fetchStudentID();
  }, []);

  const handleSubmit = () => {
    if (enteredStudentID.toLowerCase() === studentID.toLowerCase()) {
      setConfirmationSuccess(true);
      setWrongID(false);
    } else {
      setWrongID(true);
      setConfirmationSuccess(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>Student ID Confirmation</Text>
        {wrongID && <Text style={{ color: 'red' }}>Wrong student ID. Ex. b201210590 or B201210590</Text>}
        {confirmationSuccess && <Text style={{ color: 'green' }}>Student ID confirmed successfully!</Text>}
        {confirmationSuccess && navigation.navigate('Timer')}
      </View>
      <View style={{ width: '80%' }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
          type='text'
          value={enteredStudentID}
          onChangeText={(text) => setEnteredStudentID(text)}
          required
          placeholder='Enter Student ID'
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#007BFF',
            padding: 10,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: 'white' }}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text>For any problems while trying to register, contact tech support.</Text>
      </View>
    </View>
  );
};

export default ConfirmSID;
