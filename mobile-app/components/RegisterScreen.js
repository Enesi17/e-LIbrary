import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../firebase';

const RegisterScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentID, setStudentID] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }

      const auth = getAuth(firebaseApp);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully:', userCredential.user);
      navigation.navigate('ReservationScreen');
    } catch (error) {
      setError(error.message);
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentID}
        onChangeText={(text) => setStudentID(text)}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
          Login here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginText: {
    marginTop: 20,
  },
  loginLink: {
    color: 'blue',
  },
});

export default RegisterScreen;