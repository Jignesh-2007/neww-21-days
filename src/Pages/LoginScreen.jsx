import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';



const LoginScreen = ({ navigation }) => {
  // Navigation functions
  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (email.toLowerCase() === 'admin' && password === '1234') {
      navigateToHome(); // Navigate on successful login
    } else {
      Alert.alert('Failed', 'Invalid username or password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
            source={require('../../assets/edgee.jpg')} // Make sure this path is correct
            style={styles.background}
            imageStyle={{ opacity: 0.3 }} // Adjusted opacity and position
            resizeMode="cover"
          >
            <View style={styles.container}>
              {/* Heading */}
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Begin The</Text>
                <Text style={styles.heading}>Journey Today</Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Username or Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.inputBox}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />

                <TouchableOpacity style={styles.buttonStyle} onPress={handleLogin}>
                  <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.signupContainer}>
                <Text style={styles.signText}>Don't have an account?</Text>
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={styles.signUpLinkText}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headingContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 42,
    // fontFamily: 'Aboreto', // Ensure this font is loaded
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  formContainer: {
    alignItems: 'center',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: NEON_BLUE,
    backgroundColor: '#161b22',
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonStyle: {
    backgroundColor: NEON_BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  buttonText: {
    color: DARK_BG,
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotText: {
    fontSize: 14,
    color: NEON_BLUE,
    marginTop: 20,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  signText: {
    fontSize: 15,
    color: '#888',
  },
  signUpLinkText: {
    fontSize: 15,
    color: NEON_BLUE,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
