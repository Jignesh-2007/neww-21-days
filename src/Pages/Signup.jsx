import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';

const Signup = ({ navigation }) => {
  const [form, setForm] = useState({ email: '', password: '', profilePic: null });
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });

    // Clear error when user starts typing
    if (key === 'email') setEmailError('');
    if (key === 'password') setPasswordError('');
    setGeneralError('');
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) {
        setForm((prevForm) => ({ ...prevForm, profilePic: response.assets[0].uri }));
      }
    });
  };

  const uploadImageToStorage = async (uri, userId) => {
    if (!uri) return null;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const reference = storage().ref(`profilePics/${userId}/${filename}`);
    try {
      await reference.putFile(uri);
      return await reference.getDownloadURL();
    } catch {
      return null;
    }
  };

  const handleSignup = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let valid = true;

    // Local validation
    if (!form.email.trim()) {
      setEmailError('Enter your email');
      valid = false;
    } else if (!form.email.includes('@') || !form.email.includes('.')) {
      setEmailError('Enter a valid email');
      valid = false;
    }

    if (!form.password.trim()) {
      setPasswordError('Enter your password');
      valid = false;
    } else if (form.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(form.email, form.password);
      const userId = userCredential.user.uid;

      let imageURL = form.profilePic
        ? await uploadImageToStorage(form.profilePic, userId)
        : null;
      const username = form.email.split('@')[0];

      await database().ref(`/users/${userId}/profile`).set({
        userId,
        email: form.email,
        username,
        profilePicUrl: imageURL,
        createdAt: new Date().toISOString(),
      });

      // ----------------------------------------------------
      // CHANGE: Navigate to 'ProfileScreen' instead of 'HomeScreen'
      navigation.replace('ProfileScreen');
      // ----------------------------------------------------

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('That email address is already in use');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('That email address is invalid');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password is too weak (min 6 characters)');
      } else {
        setGeneralError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
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

              <View style={styles.profileContainer}>
                <Image
                  source={
                    form.profilePic
                      ? { uri: form.profilePic }
                      : require('../../assets/pimg.png')
                  }
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
                  <Text style={{ color: DARK_BG, fontWeight: 'bold' }}>Upload Image</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={form.email}
                  onChangeText={(text) => handleInput('email', text)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TextInput
                  style={styles.inputBox}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(text) => handleInput('password', text)}
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

                <TouchableOpacity
                  style={[styles.buttonStyle, loading && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={DARK_BG} />
                  ) : (
                    <Text style={styles.buttonText}>SIGN UP</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.signUpLinkText}>Log in</Text>
                  </TouchableOpacity>
                </View>
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
  headingContainer: { marginBottom: 30, alignItems: 'center' },
  heading: {
    fontSize: 42,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: NEON_BLUE,
  },
  uploadButton: {
    backgroundColor: NEON_BLUE,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
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
  errorText: { color: 'red', fontSize: 12, marginBottom: 8, width: '100%' },
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
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  signText: { fontSize: 15, color: '#888' },
  signUpLinkText: { fontSize: 15, color: NEON_BLUE, fontWeight: 'bold' },
});

export default Signup;