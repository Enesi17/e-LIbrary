import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../firebase';

const ConfirmLogin = ({ navigation }) => {

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [error, setError] = useState(null);

    //   const { login, logout } = useAuth(); // Adjust this based on your actual AuthContext
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
  
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Confirmation was done successfully');
      navigation.navigate('TimerScreen');
    } catch (error) {
      setError('Login Failed');
      console.error('Error logging in:', error.message);
    }
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
      <Text style={styles.title}>Confirmation To Start Timer</Text>
      {/* {loginFail && (
        <Alert style={styles.alert} variant="danger">
          Confirm failed
        </Alert>
      )} */}
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        ref={emailRef}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        ref={passwordRef}
      />
      <Button title="Confirm" onPress={handleLogin} />
      {/* {loginSuccess && (
        <Alert style={styles.alert} variant="success">
          Login successfully
        </Alert>
      )} */}
      {/* {loginSuccess &&
        setTimeout(function () {
          window.location.pathname = '/timer'; // Adjust this based on your navigation method
        }, 100)} */}
      {/* currentUser && <Button type="button" onPress={handleLogout}>Logout</Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  alert: {
    marginTop: 10,
  },
});

export default ConfirmLogin;