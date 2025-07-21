import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

// WARNING: It is NOT recommended to store API keys in your code.
// Use environment variables or a secure secret management solution.
// 1. Replace with your actual API key
const API_KEY = 'AIzaSyAXY89BCqjYuxB5J5iY1nJ6y7Rva0hDX3Y';

// 2. Initialize the model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const Ai = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    // We will use the text from the input field as the prompt
    if (!prompt) {
      setResult('Please enter a prompt first.');
      return;
    }
    setLoading(true);
    setResult(''); // Clear previous result
    try {
      // 3. Call the model with the user's prompt
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      setResult(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setResult('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.mainCard}>
        {/* --- Title --- */}
        <Text style={styles.title}>
          Ask the COACH<Text style={styles.titleHighlight}></Text>
        </Text>

        {/* --- Text Input for Prompt --- */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="What do you want to ask?"
            placeholderTextColor="#007B7B" // A darker cyan for placeholder
            multiline
          />
        </View>

        {/* --- Result Display Area --- */}
        <ScrollView style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00ffff" style={styles.loading} />
          ) : (
            <Text style={styles.resultText}>{result}</Text>
          )}
        </ScrollView>

        {/* --- Generate Button --- */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Generate Content</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 4. Add the Neon styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 15,
  },
  mainCard: {
    backgroundColor: '#050A0A',
    borderRadius: 25,
    padding: 25,
    // Neon border effect for the main card
    borderColor: '#6A0DAD', // Purple color for the outer glow
    borderWidth: 2,
    shadowColor: '#6A0DAD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10, // For Android shadow
  },
  title: {
    color: '#00ffff', // Cyan color
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleHighlight: {
    color: '#BE00FF', // A different neon color for the brackets
  },
  inputContainer: {
      backgroundColor: '#101010',
      borderRadius: 15,
      borderColor: '#00ffff',
      borderWidth: 1,
      marginBottom: 20,
      minHeight: 100,
      padding: 10,
      justifyContent: 'flex-start',
  },
  input: {
    color: '#00ffff',
    fontSize: 16,
    textAlignVertical: 'top', // Ensures text starts from the top in multiline
  },
  resultContainer: {
    flexGrow: 0, // Prevent it from taking all available space initially
    minHeight: 150, // Give it a minimum height
    maxHeight: 300, // But don't let it grow indefinitely
    backgroundColor: '#101010',
    borderRadius: 15,
    borderColor: '#00ffff',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
  },
  resultText: {
    color: '#00ffff',
    fontSize: 16,
    lineHeight: 24,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)', // Translucent cyan
    borderRadius: 50,
    paddingVertical: 15,
    // Neon border for the button
    borderColor: '#00ffff',
    borderWidth: 2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default Ai;
