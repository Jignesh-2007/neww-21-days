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

const NEON_PURPLE = '#f7b3ff';
const COMPLETED_GREEN = '#2ecc71';
const DARK_BG = '#0d1117';

const Music = () => {
  const [musicTasks, setMusicTasks] = useState([]);

  // Modal state
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch music category tasks
  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const tasksRef = database()
          .ref(`/users/${user.uid}/tasks`)
          .orderByChild('category')
          .equalTo('Music');

        const onValueChange = tasksRef.on('value', snapshot => {
          const tasksData = snapshot.val();
          if (tasksData) {
            const filteredMusicTasks = Object.keys(tasksData)
              .map(key => ({
                id: key,
                ...tasksData[key],
              }))
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            setMusicTasks(filteredMusicTasks);
          } else {
            setMusicTasks([]);
          }
        });

        return () => tasksRef.off('value', onValueChange);
      } else {
        setMusicTasks([]);
      }
    });

    return authSubscriber;
  }, []);

  // Toggle completion
  const toggleTaskCompletion = (taskId, currentStatus) => {
    const user = auth().currentUser;
    if (user) {
      database()
        .ref(`/users/${user.uid}/tasks/${taskId}`)
        .update({ completed: !currentStatus });
    }
  };

  // Open delete modal
  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalVisible(true);
  };

  // Actually delete
  const deleteTask = () => {
    if (taskToDelete) {
      const user = auth().currentUser;
      if (user) {
        database()
          .ref(`/users/${user.uid}/tasks/${taskToDelete.id}`)
          .remove();
      }
    }
    setIsDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  // Render each task
  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, { borderColor: item.completed ? '#555' : NEON_PURPLE }]}>
      <TouchableOpacity
        style={styles.taskItemClickable}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
      >
        <Icon
          name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={item.completed ? COMPLETED_GREEN : NEON_PURPLE}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
            {item.title}
          </Text>
          <Text style={styles.taskDate}>
            {item.dateTime
              ? new Date(item.dateTime).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No date'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeleteTask(item)}
      >
        <Icon name="trash-can-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Music</Text>

        <FlatList
          data={musicTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No music tasks found.</Text>}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isDeleteModalVisible}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Task</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete{" "}
                <Text style={{ fontWeight: 'bold', color: NEON_PURPLE }}>
                  {taskToDelete?.title}
                </Text>
                ?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#555' }]}
                  onPress={() => {
                    setIsDeleteModalVisible(false);
                    setTaskToDelete(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ff6b6b' }]}
                  onPress={deleteTask}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

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
    color: NEON_PURPLE,
    textShadowColor: NEON_PURPLE,
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
    shadowColor: NEON_PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: NEON_PURPLE,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEON_PURPLE,
    marginBottom: 10,
  },
  modalMessage: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Music;
