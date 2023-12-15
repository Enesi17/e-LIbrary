import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import ReservationScreen from './components/ReservationScreen';
import ConfirmationScreen from './components/ConfirmationScreen'
import ConfirmLogin from './components/ConfirmLogin';
import NFCReader from './components/NFCReader';
import TimerScreen from './components/TImerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name='ReservationScreen' component={ReservationScreen} />
        <Stack.Screen name='ConfirmationScreen' component={ConfirmationScreen} />
        <Stack.Screen name='ConfirmLogin' component={ConfirmLogin}/>
        <Stack.Screen name='NFCReader' component={NFCReader} />
        <Stack.Screen name='TimerScreen' component={TimerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
