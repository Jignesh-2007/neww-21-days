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

const Sport = () => {
  const [sportTasks, setSportTasks] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        const tasksRef = database()
          .ref(`/users/${user.uid}/tasks`)
          .orderByChild('category')
          .equalTo('Sport');

        const onValueChange = tasksRef.on('value', snapshot => {
          const tasksData = snapshot.val();
          if (tasksData) {
            const filteredSportTasks = Object.keys(tasksData).map(key => ({
              id: key,
              ...tasksData[key],
            })).sort((a, b) => b.createdAt - a.createdAt);
            setSportTasks(filteredSportTasks);
          } else {
            setSportTasks([]);
          }
        });

        return () => tasksRef.off('value', onValueChange);
      } else {
        setSportTasks([]);
      }
    });

    return authSubscriber;
  }, []);

  const toggleTaskCompletion = (taskId, currentStatus) => {
    const user = auth().currentUser;
    if (user) {
      database()
        .ref(`/users/${user.uid}/tasks/${taskId}`)
        .update({ completed: !currentStatus });
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    const user = auth().currentUser;
    if (user && taskToDelete) {
      database()
        .ref(`/users/${user.uid}/tasks/${taskToDelete.id}`)
        .remove();
    }
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, { borderColor: item.completed ? '#555' : NEON_GREEN }]}>
      <TouchableOpacity
        style={styles.taskItemClickable}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
      >
        <Icon
          name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={item.completed ? COMPLETED_GREEN : NEON_GREEN}
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
        <Text style={styles.title}>Sport</Text>

        <FlatList
          data={sportTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No sport tasks found.</Text>}
        />
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete "{taskToDelete?.title}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles ---
const NEON_GREEN = '#39ff14';
const COMPLETED_GREEN = '#2ecc71';
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
    color: NEON_GREEN,
    textShadowColor: NEON_GREEN,
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
    shadowColor: NEON_GREEN,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#161b22',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: NEON_GREEN,
    shadowColor: NEON_GREEN,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEON_GREEN,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  deleteConfirmButton: {
    backgroundColor: '#ff4d4d',
  },
  cancelText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Sport;
 