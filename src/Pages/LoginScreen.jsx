import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';

const LoginScreen = ({ navigation }) => {
  const navigateToHome = () => {
    navigation.replace('HomeScreen');
  };
  const navigateToSignup = () => {
    navigation.replace('Signup');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let valid = true;

    if (!email.trim()) {
      setEmailError('Enter your email');
      valid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Enter a valid email');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Enter your password');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    const authInstance = getAuth();

    signInWithEmailAndPassword(authInstance, email, password)
      .then(() => {
        navigateToHome();
      })
      .catch(() => {
        setGeneralError('Invalid email or password');
      })
      .finally(() => {
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
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TextInput
                  style={styles.inputBox}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

                <TouchableOpacity
                  style={[styles.buttonStyle, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={DARK_BG} />
                  ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                  )}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK_BG },
  scrollContainer: { flexGrow: 1 },
  background: { flex: 1, backgroundColor: DARK_BG },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  headingContainer: { marginBottom: 40, alignItems: 'center' },
  heading: {
    fontSize: 42,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  formContainer: { alignItems: 'center', width: '100%' },
  inputBox: {
    borderWidth: 1,
    borderColor: NEON_BLUE,
    backgroundColor: '#161b22',
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    borderRadius: 12,
    fontSize: 16,
    color: '#fff',
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 5,
  },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, width: '100%' },
  buttonStyle: {
    backgroundColor: NEON_BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 10,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  buttonDisabled: { backgroundColor: '#0a7575', shadowOpacity: 0.5, elevation: 5 },
  buttonText: { color: DARK_BG, fontWeight: 'bold', fontSize: 18 },
  forgotText: { fontSize: 14, color: NEON_BLUE, marginTop: 20, textAlign: 'center' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  signText: { fontSize: 15, color: '#888' },
  signUpLinkText: { fontSize: 15, color: NEON_BLUE, fontWeight: 'bold' },
});

export default LoginScreen;
