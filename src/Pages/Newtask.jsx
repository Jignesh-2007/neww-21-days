import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Newtask({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Add Title"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Add Description"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Date and Time</Text>
      <TouchableOpacity style={styles.inputButton}>
        <Icon name="clock-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Select Date and Time</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Category</Text>
      <TouchableOpacity style={styles.inputButton}>
        <Icon name="tag-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Select Category</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Priority</Text>
      <TouchableOpacity style={styles.inputButton}>
        <Icon name="flag-outline" size={20} color="white" />
        <Text style={styles.buttonText}>Select Priority</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Reminder</Text>
      <TouchableOpacity style={styles.inputButton}>
        <Icon name="alarm" size={20} color="white" />
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000'
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 20,
    fontFamily: 'Cursive'
  },
  label: {
    fontSize: 14,
    color: 'white',
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#a78bfa',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: 'white',
    marginBottom: 10
  },
  inputButton: {
    borderWidth: 1,
    borderColor: '#a78bfa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Cursive',
    fontSize: 14
  },
  saveButton: {
    backgroundColor: '#a78bfa',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cursive'
  }
});