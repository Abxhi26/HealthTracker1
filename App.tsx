import React, { useState,useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  SafeAreaView } from 'react-native';

import {
  initialize,
  requestPermission,
  readRecords
} from 'react-native-health-connect';

import { setupBackgroundSync } from './src/services/BackgroundHealthSync';

type HealthData = {
  steps: number;
  height: number;
  weight: number;
  sleepDuration: number;
  distance:number;
  heartRate:number;
  calories:number;

};



const App: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    height: 0,
    weight: 0,
    sleepDuration: 0,
    distance: 0,
    heartRate: 0,
    calories: 0,


  });


//background sync
  //useEffect(() => {
   // setupBackgroundSync();
  //}, []);



  const [loading, setLoading] = useState<boolean>(false);

  const fetchHealthData = async () => {
    try {
      setLoading(true);

      
      const isInitialized = await initialize();
      if (!isInitialized) throw new Error('Initialization failed');

      await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'read', recordType: 'Height' },
        { accessType: 'read', recordType: 'SleepSession' },
        { accessType: 'read', recordType: 'Distance' },
        { accessType: 'read', recordType: 'HeartRate' },
        { accessType: 'read', recordType: 'Weight' },
        { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      ]);

  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const timeRangeFilter = {
        operator: 'between' as const,
        startTime: startOfDay,
        endTime: endOfDay
      };

      const weightResult = await readRecords('Weight', { timeRangeFilter });
      const latestWeight = weightResult.records && weightResult.records.length > 0
        ? weightResult.records[weightResult.records.length - 1].weight.inKilograms
        : 0;

      
      const stepsResult = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = stepsResult.records
        ? stepsResult.records.reduce((sum: number, record: any) => sum + (record.count || 0), 0)
        : 0;

      const distanceResult = await readRecords('Distance', { timeRangeFilter });
      const totalDistance = distanceResult.records
        ? distanceResult.records.reduce((sum: number, record: any) => sum + (record.distance?.meters || 0), 0)
        : 0;

      const heartRateResult = await readRecords('HeartRate', { timeRangeFilter });
      const avgHeartRate =
        heartRateResult.records && heartRateResult.records.length > 0
          ? heartRateResult.records.reduce((sum: number, record: any) => sum + (record.samples?.[0]?.beatsPerMinute || 0), 0) /
          heartRateResult.records.length
            : 0;

      
      const heightResult = await readRecords('Height', { timeRangeFilter });
      const latestHeight = heightResult.records && heightResult.records.length > 0
        ? heightResult.records[heightResult.records.length - 1].height.inMeters
        : 0;

      const caloriesResult = await readRecords('TotalCaloriesBurned', { timeRangeFilter });
      const totalCalories = caloriesResult.records
        ? caloriesResult.records.reduce((sum: number, record: any) => sum + (record.energy?.kilocalories || 0), 0)
        : 0;

      
      const sleepResult = await readRecords('SleepSession', { timeRangeFilter });
      const totalSleep = sleepResult.records
        ? sleepResult.records.reduce((sum: number, record: any) => {
          const start = new Date(record.startTime);
          const end = new Date(record.endTime);
          return sum + (end.getTime() - start.getTime());
        }, 0)
        : 0;

      setHealthData({
        steps: totalSteps,
        height: latestHeight,
        sleepDuration: totalSleep / (1000 * 60 * 60),
        distance: totalDistance / 1000, 
        heartRate: avgHeartRate,
        weight: latestWeight,
        calories:totalCalories,
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={loading ? "Fetching..." : "Get Health Data"}
        onPress={fetchHealthData}
        disabled={loading}
      />
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>
          Steps: {healthData.steps.toLocaleString()}
        </Text>
        <Text style={styles.dataText}>
          Height: {(healthData.height * 100).toFixed(1)} cm
        </Text>
        <Text style={styles.dataText}>
          Weight: {healthData.weight.toFixed(1)} kg
        </Text>
        <Text style={styles.dataText}>
          Sleep: {healthData.sleepDuration.toFixed(1)} hours
        </Text>
        <Text style={styles.dataText}>
          HeartRate: {healthData.heartRate.toFixed(1)} beatsPerMinute
        </Text>
        <Text style={styles.dataText}>
          Distance: {healthData.distance.toFixed(1)} km
        </Text>
        <Text style={styles.dataText}>
          Calories: {healthData.calories.toFixed(1)} KCal
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#9fd18a',
    borderRadius: 8,
  },
  dataText: {
    fontSize: 18,
    marginVertical: 5,
  },

  button: {
    width: '100%',
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#23a6d5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default App;
