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
  ActivityIndicator, // Use ActivityIndicator for loading
} from 'react-native';
// Import the necessary Firebase Auth functions
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
  // Navigation functions
  const navigateToHome = () => {
    navigation.replace('HomeScreen');
  };
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  // State for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // This is the new, secure handleLogin function
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    // Get the Firebase Auth instance
    const authInstance = getAuth();

    // Securely sign in with Firebase Authentication
    signInWithEmailAndPassword(authInstance, email, password)
      .then((userCredential) => {
        // Success! User is logged in.
        console.log('User signed in successfully:', userCredential.user.uid);
        navigateToHome();
      })
      .catch((error) => {
        // Failure. Handle errors.
        console.error('Login Error:', error.code);
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      })
      .finally(() => {
        // This runs whether login succeeds or fails
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
            source={require('../../assets/edgee.jpg')}
            style={styles.background}
            imageStyle={{ opacity: 0.3 }}
            resizeMode="cover"
          >
            <View style={styles.container}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Begin The</Text>
                <Text style={styles.heading}>Journey Today</Text>
              </View>

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

                <TouchableOpacity
                  style={[styles.buttonStyle, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {/* Show ActivityIndicator when loading */}
                  {loading ? (
                    <ActivityIndicator color={DARK_BG} />
                  ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

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
    justifyContent: 'center', // Center the ActivityIndicator
    minHeight: 50, // Ensure button has a consistent height
    marginTop: 10,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  buttonDisabled: {
    backgroundColor: '#0a7575',
    shadowOpacity: 0.5,
    elevation: 5,
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