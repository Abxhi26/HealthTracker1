import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addDays, subDays } from 'date-fns';

const DateScroller = ({
    currentDate,
    onDateChange,
}: {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => onDateChange(subDays(currentDate, 1))}
            >
                <Text style={styles.arrowText}>←</Text>
            </TouchableOpacity>
            <View style={styles.dateBox}>
                <Text style={styles.dateText}>{format(currentDate, 'MMM dd, yyyy')}</Text>
            </View>
            <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => onDateChange(addDays(currentDate, 1))}
                disabled={format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
            >
                <Text
                    style={[
                        styles.arrowText,
                        format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && styles.arrowDisabled,
                    ]}
                >
                    →
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: '#16213e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    arrowButton: {
        padding: 10,
    },
    arrowText: {
        fontSize: 28,
        color: '#4fc3f7',
        fontWeight: 'bold',
    },
    arrowDisabled: {
        color: '#555',
    },
    dateBox: {
        backgroundColor: '#0f1419',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginHorizontal: 10,
        minWidth: 120,
        alignItems: 'center',
    },
    dateText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default DateScroller;
