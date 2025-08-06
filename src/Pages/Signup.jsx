import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'; // 'styles' has been correctly removed from this list.
import { launchImageLibrary } from 'react-native-image-picker';

// --- Firebase Imports ---
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const Signup = ({ navigation }) => {
  const [form, setForm] = useState({ email: '', password: '', profilePic: null });
  const [loading, setLoading] = useState(false);

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) {
        console.log('Image picker cancelled or failed:', response.errorMessage);
        return;
      }
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
    } catch (error) {
      console.error('Image Upload Error:', error);
      return null;
    }
  };

  const handleSignup = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(form.email, form.password);
      const userId = userCredential.user.uid;

      let imageURL = null;
      if (form.profilePic) {
        imageURL = await uploadImageToStorage(form.profilePic, userId);
      }

      const username = form.email.split('@')[0];

      const userProfileData = {
        userId: userId,
        email: form.email,
        username: username,
        profilePicUrl: imageURL,
        createdAt: new Date().toISOString(),
      };

      await database().ref(`/users/${userId}/profile`).set(userProfileData);

      Alert.alert('Success ✅', 'Signup successful!');
      navigation.replace('HomeScreen', { userData: userProfileData });

    } catch (error) {
      let errorMessage = 'An error occurred during signup.';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'That email address is already in use!';
            break;
          case 'auth/invalid-email':
            errorMessage = 'That email address is invalid!';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak (min 6 characters).';
            break;
          default:
            errorMessage = error.message;
            break;
        }
      }
      Alert.alert('Signup Failed ❌', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'black' }}>
        <SafeAreaView style={styles.main}>
          <Text style={styles.heading}>Begin The</Text>
          <Text style={styles.heading1}>Journey Today</Text>
          <View style={styles.profileContainer}>
            <Image
              source={form.profilePic ? { uri: form.profilePic } : require('../../assets/pimg.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.uploadIcon} onPress={handleImagePick}>
              <Text style={{ fontSize: 16, color: 'white' }}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="Email"
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(text) => handleInput('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleInput('password', text)}
          />
          <TouchableOpacity style={styles.buttonStyle} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- Complete Styles Definition ---
const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' },
  heading: { fontSize: 32, color: 'white', marginTop: 20 },
  heading1: { fontSize: 32, color: 'white', marginBottom: 40 },
  profileContainer: { alignItems: 'center', marginBottom: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff' },
  uploadIcon: { marginTop: 10 },
  inputBox: { borderWidth: 1, borderColor: 'gray', backgroundColor: 'white', padding: 12, width: '100%', borderRadius: 20, marginBottom: 15, color: 'black' },
  buttonStyle: { backgroundColor: 'blue', padding: 15, borderRadius: 27, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
});

export default Signup;