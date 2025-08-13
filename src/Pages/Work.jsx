import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const WorkScreen = () => {
  const [workTasks, setWorkTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const tasksRef = database()
          .ref(`/users/${user.uid}/tasks`)
          .orderByChild('category')
          .equalTo('Work');

        const onValueChange = tasksRef.on('value', snapshot => {
          const tasksData = snapshot.val();
          if (tasksData) {
            const filteredWorkTasks = Object.keys(tasksData).map(key => ({
              id: key,
              ...tasksData[key],
            })).sort((a, b) => b.createdAt - a.createdAt);
            setWorkTasks(filteredWorkTasks);
          } else {
            setWorkTasks([]);
          }
        });

        return () => tasksRef.off('value', onValueChange);
      } else {
        setWorkTasks([]);
      }
    });

    return authSubscriber;
  }, []);

  const toggleTaskCompletion = (taskId, currentStatus) => {
    const user = auth().currentUser;
    if (user) {
      database().ref(`/users/${user.uid}/tasks/${taskId}`).update({ completed: !currentStatus });
    }
  };

  const confirmDeleteTask = (taskId, taskTitle) => {
    setTaskToDelete({ id: taskId, title: taskTitle });
    setShowModal(true);
  };

  const deleteTask = () => {
    const user = auth().currentUser;
    if (user && taskToDelete) {
      database().ref(`/users/${user.uid}/tasks/${taskToDelete.id}`).remove();
    }
    setShowModal(false);
    setTaskToDelete(null);
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, { borderColor: item.completed ? '#555' : NEON_BLUE, shadowColor: 'transparent' }]}>
      <TouchableOpacity
        style={styles.taskItemClickable}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
      >
        <Icon
          name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={item.completed ? NEON_GREEN : NEON_BLUE}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
            {item.title}
          </Text>
          <Text style={styles.taskDate}>
            {item.dateTime ? new Date(item.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeleteTask(item.id, item.title)}
      >
        <Icon name="trash-can-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Work</Text>

        <FlatList
          data={workTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No work tasks found.</Text>}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Task</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete "{taskToDelete?.title}"?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteConfirmButton} onPress={deleteTask}>
                  <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const NEON_BLUE = '#33ffff';
const NEON_GREEN = '#39ff14';
const DARK_BG = '#0d1117';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NEON_BLUE,
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  taskCard: {
    backgroundColor: '#161b22',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  taskText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTaskText: {
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
  emptyText: {
    color: '#a9a9a9',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e252f',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: NEON_BLUE,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEON_BLUE,
    marginBottom: 10,
  },
  modalMessage: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: '#444',
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteConfirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff4c4c',
    borderRadius: 6,
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default WorkScreen;
