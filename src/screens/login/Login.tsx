import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const App: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const loginData = {
            username,
            password,
        };

        console.log('Login Data:', JSON.stringify(loginData, null, 2));

        setLoading(true);
        try {
            
            const response = await fetch('http://10.0.2.2:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                setIsLoggedIn(true);
                setLoggedInUser(username);
                Alert.alert('Success', `Welcome, ${username}!`);
            } else {
                console.log('Login failed:', data);
                Alert.alert('Login Failed', data.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Network error:', error);
            Alert.alert('Error', 'Network error - check server connection');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoggedInUser('');
        setUsername('');
        setPassword('');
    };


    if (isLoggedIn) {
        return (
            <View style={styles.container}>
                <View style={styles.loginCard}>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.welcomeText}>Hello, {loggedInUser}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#7f8fa6"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#7f8fa6"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d2dac7',
        justifyContent: 'center',
        paddingHorizontal: 24,
        alignItems: 'center',
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
        borderColor: '#a18cd1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 26,
        color: '#8f5ee8',
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
        backgroundColor: '#f7e1fa',
        color: '#22223b',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 46,
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
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 1,
    },
    welcomeText: {
        fontSize: 18,
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    credentialsContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        width: '100%',
    },
    credentialsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6c757d',
        marginBottom: 8,
        textAlign: 'center',
    },
    credentialsText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 2,
    },
});

export default App;
