import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa', // Subtle light background
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginCard: {
        width: '80%',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#222',
    },
    input: {
        width: '100%',
        height: 44,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: '#fafbfc',
    },
    button: {
        width: '100%',
        height: 44,
        backgroundColor: '#2575fc',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 1,
    },
});

export default LoginPage;
