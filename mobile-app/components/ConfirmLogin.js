import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const auth = getAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  const [confirmFail, setConfirmFail] = useState(false);
  const [email, setEmail] = useState('');
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, passwordRef.current);
      setLoginSuccess(true);
      setLoginFail(false);
      navigation.navigate('Timer');
    } catch (error) {
      setError('Login Failed');
      setLoginFail(true);
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Confirmation To Start Timer</Text>
      {loginFail && <Text style={{ color: 'red' }}>Confirm failed</Text>}
      <View style={{ width: '80%' }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
          placeholder="Enter password"
          ref={passwordRef}
          secureTextEntry
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
      {confirmFail && <Text style={{ color: 'red' }}>Wrong Email</Text>}
      {loginSuccess && <Text style={{ color: 'green' }}>Login successfully</Text>}
      {/* {currentUser && <Button type="button" onPress={handleLogout}>Logout</Button>} */}
      <Text style={{ marginTop: 20 }}>If there is any problem while trying to login, contact tech support</Text>
    </View>
  );
};

export default Login;
