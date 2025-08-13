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
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

// --- Theme Colors ---
const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';
const ERROR_COLOR = '#ff4d4d';


// --- Premium Plans Component (No changes) ---
const PLANS = [
  { id: 'monthly', title: 'Monthly Plan', duration: '30-day full access', price: 100, originalPrice: 200, discountPercent: 50, features: ['Supporting the Developers', 'Ads-Free Experience', 'Access to Customer Support'], highlightColor: '#33ffff', buttonColor: '#33ffff' },
  { id: 'yearly', title: 'Yearly Plan', duration: '1 year full access', price: 1200, originalPrice: 2400, discountPercent: 50, features: ['Supporting the Developers', 'Ads-Free Experience', 'Access to Customer Support', 'Please Buy it 🥲'], highlightColor: '#ff33ff', buttonColor: '#ff33ff' },
];
const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;
const cardMargin = 8;

const PlanCard = ({ item }) => (
  <View style={[styles.card, { borderColor: item.highlightColor, shadowColor: item.highlightColor }]}>
    <View style={styles.headerRow}>
      <Text style={[styles.title, { color: item.highlightColor, textShadowColor: item.highlightColor }]}>{item.title}</Text>
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
      <Text style={styles.buttonText}>{item.id === 'monthly' ? 'Start Monthly' : 'Start Yearly'}</Text>
    </TouchableOpacity>
  </View>
);

const PremiumModal = ({ visible, onClose }) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
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

// =================================================================
// --- Status Modal (Themed Alert) ---
// =================================================================
const StatusModal = ({ visible, onClose, title, message, isError }) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={styles.modalBackground}>
            <View style={[styles.modalView, { width: '90%' }]}>
                <MaterialCommunityIcons
                    name={isError ? "alert-circle-outline" : "check-circle-outline"}
                    size={40}
                    color={isError ? ERROR_COLOR : NEON_BLUE}
                    style={{ alignSelf: 'center', marginBottom: 15 }}
                />
                <Text style={[styles.modalHeader, { fontSize: 20, color: isError ? ERROR_COLOR : NEON_BLUE }]}>{title}</Text>
                <Text style={styles.statusMessageText}>{message}</Text>
                <TouchableOpacity style={[styles.statusModalButton, { backgroundColor: isError ? ERROR_COLOR : NEON_BLUE }]} onPress={onClose}>
                    {/* THIS IS THE FIX: Using a dedicated style for this button's text */}
                    <Text style={styles.statusModalButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

// =================================================================
// --- Change Name Modal (Updated to handle errors) ---
// =================================================================
const ChangeNameModal = ({ visible, onClose, onSave, currentUsername, onError }) => {
  const [newUsername, setNewUsername] = useState(currentUsername);

  useEffect(() => {
    setNewUsername(currentUsername);
  }, [currentUsername]);

  const handleSave = () => {
    if (newUsername.trim()) {
      onSave(newUsername.trim());
    } else {
      // Call the onError prop if the name is empty
      onError("Validation Error", "Name cannot be empty.");
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalView, { width: '90%' }]}>
          <Text style={styles.modalHeader}>Change Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter new name"
            placeholderTextColor="#888"
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
              <Text style={[styles.modalButtonText, { color: DARK_BG }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const Profile = ({ navigation }) => {
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [isChangeNameModalVisible, setChangeNameModalVisible] = useState(false);
  const [userData, setUserData] = useState({ username: 'Guest', profilePicUrl: null });
  const [taskCounts, setTaskCounts] = useState({ left: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  
  // State for the status modal
  const [statusModal, setStatusModal] = useState({
    visible: false,
    title: '',
    message: '',
    isError: false,
  });

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      setLoading(false);
      navigation.replace('LoginScreen');
      return;
    }

    const profileRef = database().ref(`/users/${currentUser.uid}/profile`);
    const onProfileChange = profileRef.on('value', snapshot => {
      const profileData = snapshot.val();
      if (profileData) {
        setUserData({
          username: profileData.username || 'User',
          profilePicUrl: profileData.profilePicUrl,
        });
      }
      setLoading(false);
    });

    const tasksRef = database().ref(`/users/${currentUser.uid}/tasks`);
    const onTasksChange = tasksRef.on('value', snapshot => {
      const tasksData = snapshot.val();
      if (tasksData) {
        const allTasks = Object.values(tasksData);
        const done = allTasks.filter(task => task.completed).length;
        const left = allTasks.length - done;
        setTaskCounts({ left, done });
      } else {
        setTaskCounts({ left: 0, done: 0 });
      }
    });

    return () => {
      profileRef.off('value', onProfileChange);
      tasksRef.off('value', onTasksChange);
    };
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('LoginScreen'))
      .catch(error => console.error("Logout error", error));
  };

  const handleChangeName = async (newName) => {
    const currentUser = auth().currentUser;

    if (!currentUser || !currentUser.uid) {
      setStatusModal({ visible: true, title: "Authentication Error", message: "Could not find user. Please log in again.", isError: true });
      return;
    }

    try {
      await currentUser.updateProfile({ displayName: newName });
      await database().ref(`/users/${currentUser.uid}/profile`).update({ username: newName });

      setUserData(prevData => ({ ...prevData, username: newName }));
      
      // Show success modal and close the change name modal
      setStatusModal({ visible: true, title: "Success", message: "Your name has been updated successfully.", isError: false });

    } catch (error) {
      console.error("Error updating name:", error);
      setStatusModal({ visible: true, title: "Update Failed", message: "Could not update your name.", isError: true });
    }
  };

  const handleCloseStatusModal = () => {
      // If the operation was a success, close the ChangeNameModal as well
      if (!statusModal.isError) {
          setChangeNameModalVisible(false);
      }
      // Reset and hide the status modal
      setStatusModal({ visible: false, title: '', message: '', isError: false });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={'#33ffff'} />
        </View>
      </SafeAreaView>
    );
  }

  const { username, profilePicUrl } = userData;
  const avatarLetter = username ? username.charAt(0).toUpperCase() : '?';

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
            <View style={styles.taskBox}><Text style={styles.taskText}>{taskCounts.left} Task Left</Text></View>
            <View style={styles.taskBox}><Text style={styles.taskText}>{taskCounts.done} Task done</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity onPress={() => setChangeNameModalVisible(true)}>
            <MenuItem icon="account-edit" label="Change account name" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPremiumVisible(true)}>
            <MenuItem icon="diamond-stone" label="Upgrade to premium" isPremium />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* navigation.navigate('About') */ }}>
            <MenuItem icon="information-outline" label="About us" />
          </TouchableOpacity>
          <MenuItem icon="message-question-outline" label="Help & Feedback" />
          <TouchableOpacity onPress={() => { /* navigation.navigate('Support') */ }}>
            <MenuItem icon="thumb-up-outline" label="Support Us" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <MenuItem icon="logout" label="Log out" isLogout />
          </TouchableOpacity>
        </View>

        <PremiumModal visible={premiumVisible} onClose={() => setPremiumVisible(false)} />
        <ChangeNameModal
          visible={isChangeNameModalVisible}
          onClose={() => setChangeNameModalVisible(false)}
          onSave={handleChangeName}
          currentUsername={username}
          onError={(title, message) => setStatusModal({ visible: true, title, message, isError: true })}
        />
        <StatusModal
            visible={statusModal.visible}
            title={statusModal.title}
            message={statusModal.message}
            isError={statusModal.isError}
            onClose={handleCloseStatusModal}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label, isPremium, isLogout }) => {
  const color = isLogout ? '#ff3b30' : isPremium ? '#33ffff' : '#fff';
  const textStyles = [styles.menuText, isLogout && { color }, isPremium && { color, fontWeight: 'bold' }];
  return (
    <View style={styles.menuItem}>
      <MaterialCommunityIcons name={icon} size={24} color={color} style={isPremium && styles.iconShadow} />
      <Text style={textStyles}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK_BG },
  container: { flex: 1, padding: 20 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatar: { backgroundColor: '#161b22', width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderColor: NEON_BLUE, borderWidth: 2, shadowColor: NEON_BLUE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, elevation: 20, overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  avatarText: { color: NEON_BLUE, fontSize: 48, fontWeight: 'bold' },
  username: { color: '#fff', fontSize: 21, fontWeight: 'bold', marginVertical: 15 },
  taskStatusContainer: { flexDirection: 'row', gap: 15, marginTop: 10 },
  taskBox: { backgroundColor: '#161b22', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderColor: 'rgba(51, 255, 255, 0.3)', borderWidth: 1 },
  taskText: { color: '#fff', fontSize: 14 },
  section: { marginTop: 30, backgroundColor: '#161b22', borderRadius: 15, padding: 10, borderColor: 'rgba(51, 255, 255, 0.2)', borderWidth: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 },
  menuText: { color: '#fff', marginLeft: 15, fontSize: 16 },
  iconShadow: { shadowColor: NEON_BLUE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalView: { backgroundColor: '#161b22', borderRadius: 20, paddingVertical: 24, alignItems: 'center', borderColor: 'rgba(51, 255, 255, 0.5)', borderWidth: 1, paddingHorizontal: 20 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 24, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  card: { width: cardWidth, backgroundColor: '#0d1117', borderRadius: 20, borderWidth: 2, marginHorizontal: cardMargin, padding: 24, alignItems: 'flex-start', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  discount: { fontSize: 14, color: DARK_BG, backgroundColor: '#fff', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 8, overflow: 'hidden', fontWeight: 'bold' },
  duration: { marginTop: 8, fontSize: 15, color: '#a9a9a9', marginBottom: 7 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  price: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginRight: 10 },
  originalPrice: { fontSize: 16, color: '#666', textDecorationLine: 'line-through' },
  features: { marginTop: 10, marginBottom: 18 },
  featureItem: { fontSize: 15, color: '#fff', marginBottom: 5 },
  button: { width: '100%', paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 10 },
  buttonText: { color: DARK_BG, fontWeight: '700', fontSize: 16 },
  closeButton: { marginTop: 20, backgroundColor: 'transparent', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, borderWidth: 1, borderColor: '#a9a9a9' },
  closeButtonText: { color: '#a9a9a9', fontWeight: '600', fontSize: 16 },
  nameInput: { width: '90%', borderWidth: 1, borderColor: NEON_BLUE, backgroundColor: DARK_BG, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, fontSize: 16, color: '#fff', marginBottom: 20, textAlign: 'center' },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '90%' },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#333', marginRight: 10 },
  saveButton: { backgroundColor: NEON_BLUE, marginLeft: 10 },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  // Styles for Status Modal
  statusMessageText: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  statusModalButton: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  statusModalButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
