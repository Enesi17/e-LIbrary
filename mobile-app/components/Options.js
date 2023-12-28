import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Options = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleReservationClick = () => {
    console.log('Making a reservation');
    navigation.navigate('Reservation');
  };

  const handleStartTimerClick = () => {
    console.log('Starting timer');
    navigation.navigate('ManageReservation');
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      // Redirect to the 'Login' screen
      navigation.navigate('Login');
    } catch (error) {
      setError('Failed to logout.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {currentUser ? (
        <>
          <Text>Library Management System</Text>
          
          <Button title="Make a Reservation" onPress={handleReservationClick} />

          <Button title="I have a Reservation" onPress={handleStartTimerClick} />
          <Button title="Log out" onPress={handleLogoutClick} />
        </>
      ) : (
        <Text>Login</Text>
      )}
    </View>
  );
};

export default Options;
