import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Reservation from "./components/Reservation";
import ManageReservation from "./components/ManageReservation";
import Options from "./components/Options";
import ConfirmCardID from "./components/ConfirmCardID";
import ConfirmLogin from "./components/ConfirmLogin";
import ConfirmSID from "./components/ConfirmSID";
import Timer from "./components/Timer";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Reservation" component={Reservation} />
        <Stack.Screen name="ManageReservation" component={ManageReservation} />
        <Stack.Screen name="Options" component={Options} />
        <Stack.Screen name="ConfirmCardID" component={ConfirmCardID} />
        <Stack.Screen name="ConfirmLogin" component={ConfirmLogin} />
        <Stack.Screen name="ConfirmSID" component={ConfirmSID} />
        <Stack.Screen name="Timer" component={Timer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
