import axios from 'axios';
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';

const FormData = () => {
    const [form, setForm] = useState({
        name: '',
        contact: '',
        email: '',
    });
    const URL = 'https://days-6e5e9-default-rtdb.firebaseio.com/21%20DAYS';
    const handleInput = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        const { name, contact, email } = form;
        if (!name.trim() || !contact.trim() || !email.trim()) {
            Alert.alert('Missing Info', 'Please fill in all fields properly.');
            return;
        }
        try {
            const response = await axios.post(`${URL}/students.json`, {
                name,
                contact,
                email,
            });
            console.log('Firebase response:', response.data);
            Alert.alert('Success ✅', 'Data saved to Firebase!');
            setForm({ name: '', contact: '', email: '' }); // Clear fields

        } catch (error) {
            console.error(error);
            Alert.alert('Error ❌', 'Something went wrong while posting.');
        }


    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.innerContainer}>
                    <Text style={styles.title}>User Registration</Text>

                    <View style={styles.inputCard}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            value={form.name}
                            onChangeText={(text) => handleInput('name', text)}
                        />

                        <Text style={styles.label}>Contact</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your contact"
                            keyboardType="phone-pad"
                            value={form.contact}
                            onChangeText={(text) => handleInput('contact', text)}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(text) => handleInput('email', text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f2f1',
    },
    innerContainer: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#020808ff',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    label: {
        fontSize: 14,
        color: '#000000ff',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#b2dfdb',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f1f8f9',
    },
    button: {
        backgroundColor: '#24e6d2ff',
        padding: 14,
        marginTop: 24,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FormData;
