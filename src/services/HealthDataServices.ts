import { initialize, readRecords } from 'react-native-health-connect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pLimit from 'p-limit';
import { format } from 'date-fns';

const MAX_CONCURRENT_CALLS = 3;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const limiter = pLimit(MAX_CONCURRENT_CALLS);

export type HealthData = {
    steps: number;
    height: number;
    weight: number;
    sleepDuration: number;
    distance: number;
    heartRate: number;
    calories: number;
};

const fetchWithCache = async <T,>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    const freshData = await fetchFn();
    await AsyncStorage.setItem(key, JSON.stringify({ data: freshData, timestamp: Date.now() }));
    return freshData;
};

export const fetchHealthDataForDate = async (date: Date): Promise<HealthData | null> => {
    try {
        const isInitialized = await initialize();
        if (!isInitialized) return null;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const timeRangeFilter = {
            operator: 'between' as const,
            startTime: startOfDay.toISOString(),
            endTime: endOfDay.toISOString()
        };

        const dataOriginFilter = {
            packageNames: ['com.google.android.apps.healthdata']
        };

        const [steps, calories, distance] = await Promise.all([
            limiter(() => readRecords('Steps' as const, { timeRangeFilter, })),
            limiter(() => readRecords('TotalCaloriesBurned' as const, { timeRangeFilter,  })),
            limiter(() => readRecords('Distance' as const, { timeRangeFilter,  }))
        ]);

        const [height, weight] = await Promise.all([
            fetchWithCache('height', () => limiter(() => readRecords('Height' as const, { timeRangeFilter,  }))),
            fetchWithCache('weight', () => limiter(() => readRecords('Weight' as const, { timeRangeFilter, })))
        ]);

        const [heartRate, sleep] = await Promise.all([
            limiter(() => readRecords('HeartRate' as const, { timeRangeFilter,  })),
            limiter(() => readRecords('SleepSession' as const, { timeRangeFilter,  }))
        ]);
    

        return {
            steps: steps.records.reduce((sum, r) => sum + (r.count || 0), 0),
            height: height.records[0]?.height?.inMeters || 0,
            weight: weight.records[0]?.weight?.inKilograms || 0,
            distance: distance.records.reduce((sum, r) => sum + (r.distance?.inMeters || 0), 0) / 1000,
            calories: calories.records.reduce((sum, r) => sum + (r.energy?.inKilocalories || 0), 0),
            heartRate: heartRate.records
                .flatMap(r => r.samples?.map(s => s.beatsPerMinute) || [])
                .reduce((sum, bpm, _, arr) => sum + bpm / arr.length, 0),
            sleepDuration: sleep.records.reduce((sum, r) => {
                const start = new Date(r.startTime);
                const end = new Date(r.endTime);
                return sum + (end.getTime() - start.getTime());
            }, 0) / (1000 * 60 * 60)
        };
    } catch (error) {
        console.error('Error fetching health data:', error);
        return null;
    }
};
