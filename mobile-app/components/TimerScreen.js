import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const TimerScreen = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialDuration, setInitialDuration] = useState(0);

  useEffect(() => {
    // Fetch timerDuration from Firebase Realtime Database
    const database = getDatabase();
    const timerDurationRef = ref(database, `floors/floor${floor}/tables/table${table}/chairs/chair${chair}/status`);

    const fetchTimerDuration = async () => {
      try {
        onValue(timerDurationRef, (snapshot) => {
          const timerDuration = snapshot.val();
          setInitialDuration(timerDuration || 0);
        });
      } catch (error) {
        console.error('Error fetching timerDuration:', error.message);
      }
    };

    fetchTimerDuration();
  }, []);

  useEffect(() => {
    let interval;

    if (isActive && seconds < initialDuration) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, initialDuration]);

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{initialDuration - seconds} seconds</Text>
      <View style={styles.buttonContainer}>
        <Button title={isActive ? 'Pause' : 'Start'} onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
});

export default TimerScreen;
