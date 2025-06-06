import { initialize, readRecords } from 'react-native-health-connect';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_INTERVAL = 15; // Minutes between syncs

export type HealthData = {
    steps: number;
    height: number;
    sleepDuration: number;
    distance: number;
    heartRate: number;
    weight: number;
    calories: number;
};

export const setupBackgroundSync = (fetchHealthData?: () => Promise<void>) => {
    BackgroundFetch.configure(
        {
            minimumFetchInterval: SYNC_INTERVAL,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            forceAlarmManager: true,
        },
        async (taskId) => {
            console.log('[Background] Syncing health data...');
            await syncHealthData();
            BackgroundFetch.finish(taskId);
        },
        (error) => {
            console.error('[Background] Config failed:', error);
        }
    );
};

export const syncHealthData = async (fetchHealthData?: () => Promise<void>) => {
    try {
        const isInitialized = await initialize();
        if (!isInitialized) return;

        const permissionsGranted = await AsyncStorage.getItem('healthPermissions');
        if (!permissionsGranted) return;

        const lastSync = await AsyncStorage.getItem('lastSync');
        const startTime = lastSync ? new Date(lastSync) : new Date(Date.now() - 86400000);
        const endTime = new Date();

        const timeRangeFilter = {
            operator: 'between' as const,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

     
        const [
            stepsResult,
            heightResult,
            sleepResult,
            distanceResult,
            heartRateResult,
            weightResult,
            caloriesResult
        ] = await Promise.all([
            readRecords('Steps' as const, { timeRangeFilter }),
            readRecords('Height' as const, { timeRangeFilter }),
            readRecords('SleepSession' as const, { timeRangeFilter }),
            readRecords('Distance' as const, { timeRangeFilter }),
            readRecords('HeartRate' as const, { timeRangeFilter }),
            readRecords('Weight' as const, { timeRangeFilter }),
            readRecords('TotalCaloriesBurned' as const, { timeRangeFilter }),
        ]);

        const healthData: HealthData = {
            steps: stepsResult.records.reduce((sum, record) => sum + (record.count || 0), 0),
            height: heightResult.records.length > 0
                ? heightResult.records[heightResult.records.length - 1].height.inMeters
                : 0,
            sleepDuration: sleepResult.records.reduce((sum, record) => {
                const start = new Date(record.startTime);
                const end = new Date(record.endTime);
                return sum + (end.getTime() - start.getTime());
            }, 0) / (1000 * 60 * 60),
            distance: distanceResult.records.reduce((sum, record) =>
                sum + (record.distance?.inMeters || 0), 0) / 1000,
            heartRate: calculateAverageHeartRate(heartRateResult.records),
            weight: weightResult.records.length > 0
                ? weightResult.records[weightResult.records.length - 1].weight.inKilograms
                : 0,
            calories: caloriesResult.records.reduce((sum, record) =>
                sum + (record.energy?.inKilocalories || 0), 0),
        };

        await AsyncStorage.setItem('healthData', JSON.stringify(healthData));
        await AsyncStorage.setItem('lastSync', endTime.toISOString());

        console.log('[Background] Health data synced successfully.');

    } catch (error) {
        console.error('[Background] Sync failed:', error);
    }
};

const calculateAverageHeartRate = (records: any[]): number => {
    const samples = records.flatMap(record =>
        record.samples?.map((s: any) => s.bpm) || []
    );
    return samples.length > 0
        ? samples.reduce((sum, bpm) => sum + bpm, 0) / samples.length
        : 0;
};

// Headless task setup
export const backgroundSyncHeadlessTask = async (event: any) => {
    if (event.timeout) {
        BackgroundFetch.finish(event.taskId);
        return;
    }
    await syncHealthData();
    BackgroundFetch.finish(event.taskId);
};

export const checkHealthPermissions = async () => {
    try {
        const granted = await AsyncStorage.getItem('healthPermissions');
        return !!granted;
    } catch (error) {
        console.error('Permission check failed:', error);
        return false;
    }
};
