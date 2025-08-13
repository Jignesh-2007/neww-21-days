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

const School = () => {
  const [schoolTasks, setSchoolTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const tasksRef = database()
          .ref(`/users/${user.uid}/tasks`)
          .orderByChild('category')
          .equalTo('School');

        const onValueChange = tasksRef.on('value', snapshot => {
          const tasksData = snapshot.val();
          if (tasksData) {
            const filteredSchoolTasks = Object.keys(tasksData).map(key => ({
              id: key,
              ...tasksData[key],
            })).sort((a, b) => b.createdAt - a.createdAt);
            
            setSchoolTasks(filteredSchoolTasks);
          } else {
            setSchoolTasks([]);
          }
        });

        return () => tasksRef.off('value', onValueChange);
      } else {
        setSchoolTasks([]);
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

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setModalVisible(true);
  };

  const deleteTask = () => {
    const user = auth().currentUser;
    if (user && taskToDelete) {
      database().ref(`/users/${user.uid}/tasks/${taskToDelete.id}`).remove();
    }
    setModalVisible(false);
    setTaskToDelete(null);
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, { borderColor: item.completed ? '#555' : NEON_PINK }]}>
      <TouchableOpacity
        style={styles.taskItemClickable}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
      >
        <Icon
          name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={item.completed ? NEON_GREEN : NEON_PINK}
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
                  minute: '2-digit'
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
        <Text style={styles.title}>School</Text>

        <FlatList
          data={schoolTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No school tasks found.</Text>}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Task</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete "{taskToDelete?.title}"?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButtonModal]}
                  onPress={deleteTask}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const NEON_PINK = '#ff33ff';
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
    color: NEON_PINK,
    textShadowColor: NEON_PINK,
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
    shadowColor: NEON_PINK,
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
    backgroundColor: '#161b22',
    borderRadius: 14,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: NEON_PINK,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEON_PINK,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  deleteButtonModal: {
    backgroundColor: '#ff4d4d',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default School;
