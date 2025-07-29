import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  Image, // Make sure Image is imported
  ActivityIndicator, // To show a loading spinner
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth, signOut } from '@react-native-firebase/auth'; // Import auth functions
import axios from 'axios'; // Import axios for GET request

// This part of your code (PLANS, PlanCard, PremiumModal) remains the same.
// ... (PLANS, PlanCard, and PremiumModal components go here, I've omitted them for brevity but they should be in your file)

const PLANS = [
  {
    id: 'monthly',
    title: 'Monthly Plan',
    duration: '30-day full access',
    price: 100,
    originalPrice: 200,
    discountPercent: 50,
    features: [
      'Supporting the Developers',
      'Ads-Free Experience',
      'Access to Customer Support',
    ],
    highlightColor: '#33ffff', // Neon Blue
    buttonColor: '#33ffff',
  },
  {
    id: 'yearly',
    title: 'Yearly Plan',
    duration: '1 year full access',
    price: 1200,
    originalPrice: 2400,
    discountPercent: 50,
    features: [
      'Supporting the Developers',
      'Ads-Free Experience',
      'Access to Customer Support',
      'Please Buy it 🥲',
    ],
    highlightColor: '#ff33ff', // Neon Pink
    buttonColor: '#ff33ff',
  },
];

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;
const cardMargin = 8;

const PlanCard = ({ item }) => (
  <View style={[styles.card, { borderColor: item.highlightColor, shadowColor: item.highlightColor }]}>
    <View style={styles.headerRow}>
      <Text style={[styles.title, { color: item.highlightColor, textShadowColor: item.highlightColor }]}>
        {item.title}
      </Text>
      <Text style={styles.discount}>{item.discountPercent}% OFF</Text>
    </View>
    <Text style={styles.duration}>{item.duration}</Text>
    <View style={styles.priceRow}>
      <Text style={styles.price}>₹{item.price}.00</Text>
      <Text style={styles.originalPrice}>₹{item.originalPrice}.00</Text>
    </View>
    <View style={styles.features}>
      {item.features.map((feature, idx) => (
        <Text key={idx} style={styles.featureItem}>• {feature}</Text>
      ))}
    </View>
    <TouchableOpacity style={[styles.button, { backgroundColor: item.buttonColor, shadowColor: item.buttonColor }]}>
      <Text style={styles.buttonText}>
        {item.id === 'monthly' ? 'Start Monthly' : 'Start Yearly'}
      </Text>
    </TouchableOpacity>
  </View>
);

const PremiumModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalView}>
        <Text style={styles.modalHeader}>21 DAYS PRO</Text>
        <FlatList
          data={PLANS}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PlanCard item={item} />}
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 2 * cardMargin}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: cardMargin }}
          pagingEnabled
          style={{ flexGrow: 0, width: '100%' }}
        />
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const Profile = ({ navigation }) => {
  const [premiumVisible, setPremiumVisible] = useState(false);
  
  // --- NEW: State for storing user data and loading status ---
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- NEW: useEffect to fetch data when the screen loads ---
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userId = currentUser.uid;
        const URL = `https://days-6e5e9-default-rtdb.firebaseio.com/USer/${userId}.json`;
        
        try {
          const response = await axios.get(URL);
          if (response.data) {
            setUserData(response.data); // Save fetched data to state
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Optionally, show an error message to the user
        }
      }
      setLoading(false); // Stop loading once done
    };

    fetchUserData();
  }, []); // The empty array [] means this effect runs only once

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => navigation.replace('LoginScreen'))
      .catch(error => console.error("Logout error", error));
  };
  
  // --- NEW: Show a loading spinner while data is being fetched ---
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={NEON_BLUE} />
        </View>
      </SafeAreaView>
    );
  }

  // --- Use fetched data, with fallbacks for safety ---
  const username = userData?.username || 'Guest';
  const profilePicUrl = userData?.profilePicUrl;
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {profilePicUrl ? (
              <Image source={{ uri: profilePicUrl }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            )}
          </View>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.taskStatusContainer}>
            <View style={styles.taskBox}>
              <Text style={styles.taskText}>0 Task Left</Text>
            </View>
            <View style={styles.taskBox}>
              <Text style={styles.taskText}>0 Task done</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <MenuItem icon="account-edit" label="Change account name" />
          <TouchableOpacity onPress={() => setPremiumVisible(true)}>
            <MenuItem icon="diamond-stone" label="Upgrade to premium" isPremium />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('About')}>
            <MenuItem icon="information-outline" label="About us" />
          </TouchableOpacity>
          <MenuItem icon="message-question-outline" label="Help & Feedback" />
          <TouchableOpacity onPress={() => navigation.navigate('Support')}>
            <MenuItem icon="thumb-up-outline" label="Support Us" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <MenuItem icon="logout" label="Logout" isLogout />
          </TouchableOpacity>
        </View>
        <PremiumModal
          visible={premiumVisible}
          onClose={() => setPremiumVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// MenuItem component remains the same
const MenuItem = ({ icon, label, isPremium, isLogout }) => {
  const color = isLogout ? '#ff3b30' : isPremium ? '#33ffff' : '#fff';
  const textStyles = [
    styles.menuText,
    isLogout && { color },
    isPremium && { color, fontWeight: 'bold' }
  ];

  return (
    <View style={styles.menuItem}>
      <MaterialCommunityIcons name={icon} size={24} color={color} style={isPremium && styles.iconShadow} />
      <Text style={textStyles}>{label}</Text>
    </View>
  );
};


const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';

// Styles remain the same, with one addition for the profile image
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    backgroundColor: '#161b22',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: NEON_BLUE,
    borderWidth: 2,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: NEON_BLUE,
    fontSize: 48,
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  taskStatusContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  taskBox: {
    backgroundColor: '#161b22',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: 'rgba(51, 255, 255, 0.3)',
    borderWidth: 1,
  },
  taskText: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginTop: 30,
    backgroundColor: '#161b22',
    borderRadius: 15,
    padding: 10,
    borderColor: 'rgba(51, 255, 255, 0.2)',
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
  iconShadow: {
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '95%',
    backgroundColor: '#161b22',
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    borderColor: 'rgba(51, 255, 255, 0.5)',
    borderWidth: 1,
  },
  modalHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#0d1117',
    borderRadius: 20,
    borderWidth: 2,
    marginHorizontal: cardMargin,
    padding: 24,
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  discount: {
    fontSize: 14,
    color: DARK_BG,
    backgroundColor: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  duration: {
    marginTop: 8,
    fontSize: 15,
    color: '#a9a9a9',
    marginBottom: 7,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  features: {
    marginTop: 10,
    marginBottom: 18,
  },
  featureItem: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: DARK_BG,
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a9a9a9',
  },
  closeButtonText: {
    color: '#a9a9a9',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Profile;
