import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import NFCLogo from '../img/nfcLogo.png';

const NFCReader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read Your Student Card to Start the Timer</Text>
      <Image source={NFCLogo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 'auto', // This style may need to be adjusted based on your layout requirements
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  logo: {
    width: 200, // Adjust the width based on your image dimensions
    height: 200, // Adjust the height based on your image dimensions
  },
});

export default NFCReader;