import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

// --- Neon-themed Task Detail Modal Component ---
const TaskDetailModal = ({ visible, onClose, task }) => {
  if (!task) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return { date: 'Not set', time: 'Not set' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit',
      }),
    };
  };

  const formattedDateTime = formatDate(task.dateTime);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{task.title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color="#aaa" />
              </TouchableOpacity>
            </View>

            {task.description ? (
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Description</Text>
                <Text style={styles.modalDescription}>{task.description}</Text>
              </View>
            ) : null}

            <View style={styles.modalSection}>
              <View style={styles.modalDetailRow}>
                <Icon name="calendar-month-outline" size={22} color={NEON_BLUE} />
                <Text style={styles.modalDetailText}>{formattedDateTime.date}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Icon name="clock-outline" size={22} color={NEON_BLUE} />
                <Text style={styles.modalDetailText}>{formattedDateTime.time}</Text>
              </View>
              {task.category && (
                <View style={styles.modalDetailRow}>
                  <Icon name="tag-outline" size={22} color={NEON_BLUE} />
                  <Text style={styles.modalDetailText}>{task.category}</Text>
                </View>
              )}
              {task.priority && (
                <View style={styles.modalDetailRow}>
                  <Icon name="flag-outline" size={22} color={NEON_BLUE} />
                  <Text style={styles.modalDetailText}>{task.priority}</Text>
                </View>
              )}
              {task.reminder && (
                <View style={styles.modalDetailRow}>
                  <Icon name="alarm" size={22} color={NEON_BLUE} />
                  <Text style={styles.modalDetailText}>Reminder is set</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// --- Main Progress Screen Component ---
const Progress = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
        console.log("ProgressScreen: No user logged in.");
        setTasks([]); // Clear tasks if no user
        return;
    }

    // --- FIX 1: Use the correct path 'users' (lowercase) ---
    const tasksRef = database().ref(`/users/${user.uid}/tasks`);

    const onValueChange = tasksRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const tasksList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        })).sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
        setTasks(tasksList);
        console.log("Tasks fetched successfully for user:", user.uid);
      } else {
        setTasks([]);
        console.log("No tasks found for user:", user.uid);
      }
    });

    // Detach the listener when the component unmounts
    return () => tasksRef.off('value', onValueChange);
  }, []);

  const toggleTaskCompletion = (taskId, currentStatus) => {
    const user = auth().currentUser;
    if (user) {
        // --- FIX 2: Use the correct path 'users' (lowercase) ---
        database().ref(`/users/${user.uid}/tasks/${taskId}`).update({ completed: !currentStatus });
    }
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    const user = auth().currentUser;
    if (user) {
        Alert.alert("Delete Task", `Are you sure you want to delete "${taskTitle}"?`, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            // --- FIX 3: Use the correct path 'users' (lowercase) ---
            onPress: () => database().ref(`/users/${user.uid}/tasks/${taskId}`).remove(),
            style: "destructive"
          }
        ]);
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setDetailModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskItemContainer, { borderColor: item.completed ? '#555' : NEON_BLUE, shadowColor: item.completed ? 'transparent' : NEON_BLUE }]}>
      <TouchableOpacity
        style={styles.taskItemClickable}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
        onLongPress={() => openTaskDetails(item)}
      >
        <Icon
          name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={item.completed ? NEON_GREEN : NEON_BLUE}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskName, item.completed && styles.completedTaskName]}>
            {item.title}
          </Text>
          <Text style={styles.taskDate}>
            {item.dateTime ? new Date(item.dateTime).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id, item.title)}
      >
        <Icon name="trash-can-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Progress</Text>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="clipboard-list-outline" size={80} color={NEON_BLUE} style={styles.iconShadow} />
          <Text style={styles.emptyText}>No tasks added yet!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TaskDetailModal
        visible={isDetailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        task={selectedTask}
      />
    </SafeAreaView>
  );
};

const NEON_BLUE = '#33ffff';
const NEON_GREEN = '#39ff14';
const DARK_BG = '#0d1117';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    paddingTop: 20,
    paddingHorizontal: 18,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  listContainer: {
    paddingBottom: 80,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  taskItemClickable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 16,
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  taskName: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTaskName: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDate: {
    fontSize: 13,
    color: '#888',
  },
  deleteButton: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    color: NEON_BLUE,
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  iconShadow: {
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 17, 23, 0.9)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#161b22',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: NEON_BLUE,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 255, 255, 0.2)',
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  modalSection: {
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    color: NEON_BLUE,
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
  },
});

export default Progress;