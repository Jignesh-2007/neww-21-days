import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Signup = ({ navigation }) => {
  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSignup = () => {
    if (username === '' || email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      Alert.alert('Success', 'Account created successfully!');
      navigateToHome(); 
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel || response.errorCode) {
        console.log('User cancelled or error occurred');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setProfilePic(uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ImageBackground
          source={require('../../assets/edgee.jpg')} 
          style={styles.background}
          imageStyle={{ opacity: 0.3 }}
          resizeMode='cover' 
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              {/* Heading */}
              <View style={styles.headingContainer}>
                <Text style={styles.heading1}>Create Your</Text>
                <Text style={styles.heading}>Account</Text>
              </View>

              {/* Profile Picture Upload */}
              <View style={styles.profileContainer}>
                <TouchableOpacity style={styles.profileTouchable} onPress={handleImagePick}>
                  {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <MaterialCommunityIcons name="camera-plus-outline" size={40} color={NEON_BLUE} />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.uploadText}>Add a Profile Picture</Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.inputBox}
                  placeholder='Username'
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.inputBox}
                  placeholder='Email'
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.inputBox}
                  placeholder='Password'
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />

                <TouchableOpacity style={styles.buttonStyle} onPress={handleSignup}>
                  <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
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
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 42,
    //fontFamily: 'Valorax',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: -10,
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },

  heading1: {
    fontSize: 42,
    // fontFamily: 'Valorax', 
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: -60,
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileTouchable: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#161b22',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: NEON_BLUE,
    borderWidth: 2,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: NEON_BLUE,
  },
  uploadText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
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
});

export default Signup;
