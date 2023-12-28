import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBRARY MANAGEMENT SYSTEM</Text>

      <View style={styles.home}>
        <View style={styles.homeContainer}>
          <View style={styles.group2}>
            <View style={styles.group099}>
              <Text style={styles.heading}>Library Management System.</Text>
              <Text style={styles.description}>
                We hope this app will make it easy to be as comfortable as
                possible while working in your favorite places reading your
                favorite books and creating the best projects. ENJOY!
              </Text>
            </View>
          </View>
          <View style={styles.group2510}>
            <View style={styles.group4}>
              <Text style={styles.yourAreNew}>Your are new?</Text>
              <View style={styles.group3}>
                <TouchableOpacity style={styles.register} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.group5}>
              <Text style={styles.youHaveAccount}>You have account?</Text>
              <View style={styles.group31}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    color: 'black',
    textAlign: 'center',
    margin: 20,
    fontSize: 20,
  },
  home: {
    flex: 1,
    justifyContent: 'center',
  },
  homeContainer: {
    margin: 20,
  },
  group2: {},
  group099: {},
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
  },
  group2510: {
    marginTop: 20,
  },
  group4: {},
  yourAreNew: {
    fontSize: 16,
  },
  group3: {
    marginTop: 10,
  },
  register: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  group5: {
    marginTop: 20,
  },
  youHaveAccount: {
    fontSize: 16,
  },
  group31: {
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Home;