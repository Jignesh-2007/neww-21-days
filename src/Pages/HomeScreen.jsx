import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const initialCategories = [
  { id: '1', name: 'Work', screen: 'Work', color: '#1f2a47', icon: 'briefcase-outline', iconColor: '#33ffff' },
  { id: '2', name: 'School', screen: 'School', color: '#2c1d42', icon: 'school-outline', iconColor: '#ff33ff' },
  { id: '3', name: 'Sport', screen: 'Sport', color: '#1a3a3a', icon: 'barbell-outline', iconColor: '#39ff14' },
  { id: '4', name: 'Music', screen: 'Music', color: '#3d243c', icon: 'musical-notes-outline', iconColor: '#f7b3ff' },
];


// --- Task Details Modal Component ---

const TaskDetailsModal = ({ visible, onClose, task }) => {
    if (!task) return null;

    const taskDate = new Date(task.dateTime);
    const formattedDate = taskDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = taskDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.detailsModalContent}>
                    <View style={styles.detailsHeader}>
                        <Text style={styles.detailsTitle}>{task.title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#888" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailsSeparator} />
                    
                    <Text style={styles.detailsDescriptionLabel}>DESCRIPTION</Text>
                    <Text style={styles.detailsDescriptionText}>{task.description || 'No description provided.'}</Text>

                    <View style={styles.detailsRow}>
                        <Ionicons name="calendar-outline" size={24} color="#33ffff" />
                        <Text style={styles.detailsRowText}>{formattedDate}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Ionicons name="time-outline" size={24} color="#33ffff" />
                        <Text style={styles.detailsRowText}>{formattedTime}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Ionicons name="pricetag-outline" size={24} color="#33ffff" />
                        <Text style={styles.detailsRowText}>{task.category || 'None'}</Text>
                    </View>
                    <View style={styles.detailsRow}>
                        <Ionicons name="flag-outline" size={24} color="#33ffff" />
                        <Text style={styles.detailsRowText}>{task.priority || 'None'}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};



// --- Reusable Task Item Component ---

const TaskItem = ({ task, onToggle, onDelete, onLongPress }) => {
    const iconName = task.completed ? 'check-circle' : 'checkbox-blank-circle-outline';
    const taskDate = new Date(task.dateTime);
    const formattedDateTime = taskDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <TouchableOpacity onLongPress={onLongPress} style={styles.taskItem}>
            <TouchableOpacity onPress={onToggle}>
                <MaterialCommunityIcons name={iconName} size={30} color={task.completed ? '#39ff14' : '#555'} />
            </TouchableOpacity>
            <View style={styles.taskTextContainer}>
                <Text 
                    style={[styles.taskItemTitle, task.completed && styles.taskItemTitleCompleted]} 
                    numberOfLines={1}
                >
                    {task.title}
                </Text>
                <Text style={styles.taskItemCategory}>{formattedDateTime}</Text>
            </View>
            <TouchableOpacity onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={26} color="#ff4d4d" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};


const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [categories, setCategories] = useState(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));
  const [recentTasks, setRecentTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const profileRef = database().ref(`/users/${user.uid}/profile`);
        const onProfileValueChange = profileRef.on('value', snapshot => {
          const userData = snapshot.val();
          if (userData) {
            setUserName(userData.username || 'User');
            setProfilePicUrl(userData.profilePicUrl);
          }
        });

        const tasksRef = database().ref(`/users/${user.uid}/tasks`);
        const onTasksValueChange = tasksRef.on('value', snapshot => {
          const tasksData = snapshot.val();
          
          if (tasksData) {
            const allTasks = Object.keys(tasksData).map(key => ({
                id: key,
                ...tasksData[key]
            }));
            
            let totalCompleted = 0;
            const newCategoryData = initialCategories.map(category => {
              const tasksForCategory = allTasks.filter(task => task.category === category.name);
              const completedInCategory = tasksForCategory.filter(task => task.completed).length;
              totalCompleted += completedInCategory;
              return {
                ...category,
                taskCount: tasksForCategory.length,
              };
            });

            setCategories(newCategoryData);
            const totalTasksCount = allTasks.length;
            setCompletionPercentage(totalTasksCount > 0 ? Math.round((totalCompleted / totalTasksCount) * 100) : 0);

            allTasks.sort((a, b) => b.createdAt - a.createdAt);
            setRecentTasks(allTasks.slice(0, 4));

          } else {
            setCategories(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));
            setCompletionPercentage(0);
            setRecentTasks([]);
          }
        });

        return () => {
          profileRef.off('value', onProfileValueChange);
          tasksRef.off('value', onTasksValueChange);
        };

      } else {
        setUserName('Guest');
        setProfilePicUrl(null);
        setCategories(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));
        setCompletionPercentage(0);
        setRecentTasks([]);
      }
    });

    return authSubscriber;
  }, []);

  const handleToggleTask = (taskId, currentStatus) => {
      const user = auth().currentUser;
      if (user) {
          database()
              .ref(`/users/${user.uid}/tasks/${taskId}`)
              .update({ completed: !currentStatus })
              .catch(error => console.error("Error toggling task:", error));
      }
  };

  const handleDeleteTask = (taskId) => {
      const user = auth().currentUser;
      if (user) {
          database()
              .ref(`/users/${user.uid}/tasks/${taskId}`)
              .remove()
              .catch(error => console.error("Error deleting task:", error));
      }
  };

  const handleLongPressTask = (task) => {
      setSelectedTask(task);
      setDetailsModalVisible(true);
  };

  const totalTasks = categories.reduce((sum, category) => sum + category.taskCount, 0);
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : '?';

  const navigateToProfile = () => navigation.navigate('Profile');
  const navigateToProgress = () => navigation.navigate('Progress');
  const navigateToNewTask = () => navigation.navigate('Newtask');
  const navigateToFocus = () => navigation.navigate('Focus');
  const navigateToAi = () => navigation.navigate('Ai');
  const navigateToCategory = (screenName) => navigation.navigate(screenName);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* --- Header --- */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hey {userName}!</Text>
            <TouchableOpacity onPress={navigateToProfile}>
              <View style={styles.avatar}>
                {profilePicUrl ? (
                  <Image source={{ uri: profilePicUrl }} style={styles.profileImage} />
                ) : (
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* --- Task Card --- */}
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.taskCardTitle}>
                {totalTasks > 0
                  ? `${totalTasks} Task${totalTasks > 1 ? 's' : ''} for today`
                  : 'No tasks for today'}
              </Text>
              <TouchableOpacity style={styles.viewButton} onPress={navigateToProgress}>
                <Text style={styles.viewButtonText}>View Tasks</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.percentText}>{completionPercentage}%</Text>
            </View>
          </View>

          {/* --- Categories --- */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => navigateToCategory(item.screen)}
                style={[styles.categoryCard, { backgroundColor: item.color, shadowColor: item.iconColor, borderColor: item.iconColor }]}
              >
                <Ionicons name={item.icon} size={30} color={item.iconColor} style={[styles.iconShadow, { shadowColor: item.iconColor }]} />
                <Text style={[styles.categoryTitle, { color: item.iconColor, textShadowColor: item.iconColor }]}>{item.name}</Text>
                <Text style={[styles.categoryTasks, { color: item.iconColor, textShadowColor: 'transparent' }]}>{item.taskCount} Tasks</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.tasksHeaderRow}>
            <Text style={styles.sectionTitle}>All Tasks</Text>
            <TouchableOpacity onPress={navigateToProgress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* --- Recent Tasks List --- */}
          <View style={styles.taskListContainer}>
            {recentTasks.length > 0 ? (
                recentTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.completed)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onLongPress={() => handleLongPressTask(task)}
                    />
                ))
            ) : (
                <Text style={styles.footerText}>
                    No tasks yet! Start your journey by adding your first goal — your future self will thank you.
                </Text>
            )}
          </View>

        </View>
      </ScrollView>

      {/* --- Bottom Navbar --- */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />
          <Text style={[styles.navText, { color: '#33ffff' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToProgress}>
          <MaterialCommunityIcons name="progress-check" size={28} color="#fff" />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={navigateToNewTask}>
          <Ionicons name="add" size={32} color="#0d1117" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToFocus}>
          <Ionicons name="timer-outline" size={28} color="#fff" />
          <Text style={styles.navText}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToAi}>
          <MaterialCommunityIcons name="robot-outline" size={28} color="#fff" />
          <Text style={styles.navText}>AI Coach</Text>
        </TouchableOpacity>
      </View>
      
      <TaskDetailsModal 
        visible={isDetailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        task={selectedTask}
      />
    </SafeAreaView>
  );
};

const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117'; 

const styles = StyleSheet.create({
  // Screen Layout
  safeArea: { flex: 1, backgroundColor: DARK_BG },
  scrollView: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 100 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 28, fontFamily: 'Valorax-lg25V', textShadowColor: 'rgba(255, 255, 255, 0.3)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#161b22', borderColor: NEON_BLUE, borderWidth: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  avatarText: { color: NEON_BLUE, fontSize: 20, fontWeight: 'bold' },
  
  // Top Task Summary Card
  taskCard: { backgroundColor: '#161b22', borderRadius: 20, padding: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: NEON_BLUE, borderWidth: 1, shadowColor: NEON_BLUE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 15 },
  taskCardTitle: { fontWeight: 'bold', fontSize: 19, color: '#fff' },
  viewButton: { backgroundColor: NEON_BLUE, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start', marginTop: 10 },
  viewButtonText: { color: DARK_BG, fontWeight: 'bold' },
  progressCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 5, borderColor: NEON_BLUE, justifyContent: 'center', alignItems: 'center', shadowColor: NEON_BLUE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  percentText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Section Headers
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 10, textShadowColor: 'rgba(255, 255, 255, 0.3)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  tasksHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllText: { color: NEON_BLUE, fontWeight: 'bold', fontSize: 16, marginTop: 30 },
  
  // Category Cards
  categoryCard: { width: 130, height: 130, borderRadius: 15, marginRight: 15, padding: 15, justifyContent: 'space-between', alignItems: 'flex-start', borderWidth: 1.5, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 8, elevation: 10 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  categoryTasks: { fontSize: 14, opacity: 0.8 },

  // Task List
  taskListContainer: { marginTop: 10 },
  taskItem: { backgroundColor: '#161b22', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  taskTextContainer: { flex: 1, marginHorizontal: 15 },
  taskItemTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  taskItemTitleCompleted: { textDecorationLine: 'line-through', color: '#888' },
  taskItemCategory: { color: '#a9a9a9', fontSize: 13, marginTop: 3 },
  footerText: { color: '#a9a9a9', textAlign: 'center', marginTop: 20, paddingHorizontal: 20, fontSize: 14, lineHeight: 22 },

  // Bottom Navbar
  navbar: { position: 'absolute', bottom: 10, left: 20, right: 20, height: 70, backgroundColor: '#161b22', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(51, 255, 255, 0.3)' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { color: '#a9a9a9', fontSize: 12, marginTop: 4 },
  addButton: { backgroundColor: NEON_BLUE, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', bottom: 20, shadowColor: NEON_BLUE, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 10, borderColor: '#fff', borderWidth: 2 },
  iconShadow: { textShadowColor: NEON_BLUE, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },

  // Task Details Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  detailsModalContent: { width: '90%', backgroundColor: '#161b22', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: NEON_BLUE, shadowColor: NEON_BLUE, shadowRadius: 20, shadowOpacity: 0.8, elevation: 15 },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailsTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1 },
  detailsSeparator: { height: 1, backgroundColor: 'rgba(51, 255, 255, 0.2)', marginVertical: 15 },
  detailsDescriptionLabel: { color: NEON_BLUE, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5 },
  detailsDescriptionText: { color: '#eee', fontSize: 16, lineHeight: 22, marginBottom: 20 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailsRowText: { color: '#fff', fontSize: 16, marginLeft: 15 },
});

export default HomeScreen;
