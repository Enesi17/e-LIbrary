import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleRegisterPress = () => {
    // Navigate to the registration screen
    navigation.navigate('RegisterScreen');
  };

  const handleLoginPress = () => {
    // Navigate to the login screen
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegisterPress} />
        <Button title="Login" onPress={handleLoginPress} />
      </View>
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
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HomeScreen;