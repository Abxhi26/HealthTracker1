import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthCard = ({
    icon,
    title,
    value,
    unit,
}: {
    icon: string;
    title: string;
    value: string;
    unit: string;
}) => (
    <View style={styles.card}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardUnit}>{unit}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#0f1419',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#2a2a3e',
    },
    cardIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    cardUnit: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
});

export default HealthCard;
