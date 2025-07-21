import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  // --- Navigation Functions ---
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };
  const navigateToProgress = () => {
    navigation.navigate('Progress');
  };
  const navigateToNewTask = () => {
    navigation.navigate('Newtask');
  };
  const navigateToFocus = () => {
    navigation.navigate('Focus');
  };

  const categories = [
    { id: '1', name: 'Work', color: '#1f2a47', icon: 'briefcase-outline', iconColor: '#33ffff', taskCount: 4 },
    { id: '2', name: 'School', color: '#2c1d42', icon: 'school-outline', iconColor: '#ff33ff', taskCount: 2 },
    { id: '3', name: 'Sport', color: '#1a3a3a', icon: 'barbell-outline', iconColor: '#39ff14', taskCount: 1 },
    { id: '4', name: 'Music', color: '#3d243c', icon: 'musical-notes-outline', iconColor: '#f7b3ff', taskCount: 0 },
  ];


  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/neonn.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.7 }}
        resizeMode='cover'
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            {/* --- Header --- */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Hey [user]!</Text>
              <TouchableOpacity onPress={navigateToProfile}>
                <View style={styles.avatar} />
              </TouchableOpacity>
            </View>

            {/* --- Task Card --- */}
            <View style={styles.taskCard}>
              <View>
                <Text style={styles.taskCardTitle}>No tasks for today</Text>
                <TouchableOpacity style={styles.viewButton} onPress={navigateToProgress}>
                  <Text style={styles.viewButtonText}>View Tasks</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.percentText}>0%</Text>
              </View>
            </View>

            {/* --- Categories --- */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.categoryCard, { backgroundColor: item.color, shadowColor: item.iconColor, borderColor: item.iconColor }]}>
                  <Ionicons name={item.icon} size={30} color={item.iconColor} style={[styles.iconShadow, { shadowColor: item.iconColor }]} />
                  <Text style={[styles.categoryTitle, { color: item.iconColor, textShadowColor: item.iconColor }]}>{item.name}</Text>
                  <Text style={[styles.categoryTasks, { color: item.iconColor, textShadowColor: item.iconColor }]}>{item.taskCount} Tasks</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />

            {/* --- All Tasks Section --- */}
            <View style={styles.tasksHeaderRow}>
              <Text style={styles.sectionTitle}>All Tasks</Text>
              <TouchableOpacity onPress={navigateToProgress}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {/* --- Footer Text --- */}
            <Text style={styles.footerText}>
              No tasks yet! Start your journey by adding your first goal — your future
              self will thank you.
            </Text>
          </View>
        </ScrollView>

        {/* --- Bottom Navbar --- */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />
            <Text style={[styles.navText, { color: '#33ffff' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToProgress}>
            <MaterialCommunityIcons name="progress-check" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />
            <Text style={[styles.navText, { color: '#33ffff' }]}>Progress</Text>
          </TouchableOpacity>

          {/* --- Add Button --- */}
          <TouchableOpacity style={styles.addButton} onPress={navigateToNewTask}>
            <Ionicons name="add" size={32} color="#0d1117" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToFocus}>
            <Ionicons name="timer-outline" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />
            <Text style={[styles.navText, { color: '#33ffff' }]}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>
            <Ionicons name="person-outline" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />
            <Text style={[styles.navText, { color: '#33ffff' }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>


  );
};

const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117'; // A very dark blue, almost black

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Valorax-lg25V',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161b22',
    borderColor: NEON_BLUE,
    borderWidth: 1,
  },
  taskCard: {
    backgroundColor: '#161b22',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: NEON_BLUE,
    borderWidth: 1,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  taskCardTitle: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#fff',
  },
  viewButton: {
    backgroundColor: NEON_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  viewButtonText: {
    color: DARK_BG,
    fontWeight: 'bold',
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: NEON_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  percentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  categoryCard: {
    width: 130,
    height: 130,
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  categoryTasks: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.8,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    color: NEON_BLUE,
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 10
  },
  footerText: {
    color: '#a9a9a9',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    fontSize: 14,
    lineHeight: 22,
  },
  navbar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#161b22',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 255, 255, 0.3)',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#a9a9a9',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: NEON_BLUE,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  iconShadow: {
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
});

export default HomeScreen;
