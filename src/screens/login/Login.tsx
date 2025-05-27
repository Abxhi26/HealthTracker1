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
                    placeholderTextColor="#7f8fa6"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#7f8fa6"
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
        backgroundColor: '#d2dac7', // 
        justifyContent: 'center',
        paddingHorizontal: 24,
        alignItems: 'center',
        display: 'flex',
        height: 'auto',
        
    },
    loginCard: {
        width: '82%',
        padding: 28,
        backgroundColor: '#fff',
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#9b59b6',
        marginBottom: -750,
        borderWidth: 2,
        borderColor: '#a18cd1', // Soft purple border
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 26,
        color: '#8f5ee8', // Vibrant purple
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        height: 46,
        borderColor: '#fbc2eb',
        borderWidth: 1.5,
        borderRadius: 8,
        marginBottom: 18,
        paddingHorizontal: 14,
        backgroundColor: '#f7e1fa', // Pale purple input background
        color: '#22223b',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 46,
        backgroundColor: '#8fd3f4', // Bright blue button
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 1,
    },
});

export default LoginPage;
