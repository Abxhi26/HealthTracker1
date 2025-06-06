import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, AppState, AppStateStatus, View } from 'react-native';
import { format, subDays, addDays, isToday } from 'date-fns';
import DateScroller from '../../components/DateScroller';
import { fetchHealthDataForDate, HealthData } from '../../services/HealthDataServices';
import HealthCard from '../../components/HealthCard';

const formatSleepDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
};

const MainScreen: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(false);
    const appState = useRef(AppState.currentState);

    const loadHealthData = async (date: Date = currentDate) => {
        setLoading(true);
        const data = await fetchHealthDataForDate(date);
        if (data) setHealthData(data);
        setLoading(false);
    };

    useEffect(() => {
        loadHealthData(currentDate);
    }, [currentDate]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                loadHealthData(currentDate);
            }
            appState.current = nextAppState;
        };
        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => sub.remove();
    }, [currentDate]);

    return (
        <SafeAreaView style={styles.container}>
            <DateScroller
                currentDate={currentDate}
                onDateChange={setCurrentDate}
            />
            {loading || !healthData ? (
                <ActivityIndicator size="large" color="#4fc3f7" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.grid}>
                        <HealthCard icon="👟" title="Steps" value={healthData.steps.toLocaleString()} unit="" />
                        <HealthCard icon="📏" title="Height" value={(healthData.height * 100).toFixed(1)} unit="cm" />
                        <HealthCard icon="⚖️" title="Weight" value={healthData.weight.toFixed(1)} unit="kg" />
                        <HealthCard icon="🔥" title="Calories Burned" value={healthData.calories.toFixed(0)} unit="cal" />
                        <HealthCard icon="😴" title="Sleep Duration" value={formatSleepDuration(healthData.sleepDuration)} unit="" />
                        <HealthCard icon="❤️" title="Heart Rate" value={healthData.heartRate.toFixed(0)} unit="bpm" />
                        <HealthCard icon="🏃" title="Distance" value={healthData.distance.toFixed(1)} unit="km" />
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
});

export default MainScreen;
