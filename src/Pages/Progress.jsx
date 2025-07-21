import React, { useState } from 'react';
import {
  View,
  
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Progress = () => {
  const [tasks, setTasks] = useState([
   
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Icon
        name={item.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
        size={28}
        color={item.completed ? '#8E68F2' : '#555'}
      />
      <View style={styles.taskTextContainer}>
        <Text
          style={[
            styles.taskName,
            item.completed && { textDecorationLine: 'line-through', color: '#888' },
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.taskDate}>
          {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Progress</Text>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="clipboard-list-outline" size={60} color="#bfaaff" />
          <Text style={styles.emptyText}>No tasks added yet!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* The bottom navigation bar will remain visible, as with your Profile screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 24, 
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 2,
  },
  listContainer: {
    paddingBottom: 80,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1533',
    borderRadius: 14,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  taskName: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 3,
  },
  taskDate: {
    fontSize: 13,
    color: '#bfaaff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: '#bfaaff',
    marginTop: 16,
    fontSize: 17,
    textAlign: 'center',
  },
});

export default Progress;
