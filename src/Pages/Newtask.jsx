import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

// --- Constants ---
const CATEGORIES = ['Work', 'School', 'Sport', 'Music', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

// --- Neon Theme Colors ---
const NEON_BLUE = '#33ffff';
const DARK_BG = '#0d1117';
const MODAL_BG = '#161b22';
const TEXT_COLOR = '#f0f0f0';
const BORDER_COLOR = 'rgba(51, 255, 255, 0.5)';
const SHADOW_COLOR = NEON_BLUE;

// =================================================================
// --- Reusable Picker Modal Component ---
// =================================================================
const PickerModal = ({ visible, onClose, onSelect, items, title, currentSelection }) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
    >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
            <View style={styles.pickerModalContent}>
                <Text style={styles.modalTitle}>{title}</Text>
                <View style={styles.pickerList}>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.pickerItem}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={[styles.pickerText, currentSelection === item && styles.selectedPickerText]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
);


// =================================================================
// --- Main Add Task Screen ---
// =================================================================
export default function Newtask({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState(null);
  const [reminder, setReminder] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isCategoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [isPriorityPickerVisible, setPriorityPickerVisible] = useState(false);

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for the task.');
      return;
    }

    // Get the currently logged-in user from Firebase Auth
    const user = auth().currentUser;

    // IMPORTANT: Check for the user and their UID
    if (user && user.uid) {
      const taskData = {
          title: title.trim(),
          description: description.trim(),
          dateTime: date.toISOString(),
          category,
          priority,
          reminder,
          completed: false,
          createdAt: database.ServerValue.TIMESTAMP // Best practice for sorting
      };
      
      try {
        // Save the task using the user's UID to create the correct and secure path.
        // This saves the task under /users/{the_user's_id}/tasks/
        await database().ref(`/users/${user.uid}/tasks`).push(taskData);
        
        Alert.alert('Success', 'Task saved successfully!');
        navigation.goBack();

      } catch (error) {
        console.error("Error saving task:", error);
        Alert.alert('Error', 'An error occurred while saving the task.');
      }
    } else {
      Alert.alert('Not Logged In', 'You must be logged in to save a task.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Add New Task</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput placeholder="e.g., Finish project report" placeholderTextColor="#888" style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput placeholder="e.g., Include market analysis and charts" placeholderTextColor="#888" style={[styles.input, { height: 100 }]} multiline value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Date and Time</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setDatePickerVisible(true)}>
          <Icon name="clock-outline" size={20} color={TEXT_COLOR} />
          <Text style={styles.buttonText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setCategoryPickerVisible(true)}>
          <Icon name="tag-outline" size={20} color={TEXT_COLOR} />
          <Text style={styles.buttonText}>{category || 'Select Category'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Priority</Text>
        <TouchableOpacity style={styles.inputButton} onPress={() => setPriorityPickerVisible(true)}>
          <Icon name="flag-outline" size={20} color={TEXT_COLOR} />
          <Text style={styles.buttonText}>{priority || 'Select Priority'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reminderRow} onPress={() => setReminder(!reminder)}>
            <Text style={styles.label}>Set Reminder</Text>
            <Icon name={reminder ? "bell-check" : "bell-outline"} size={24} color={reminder ? NEON_BLUE : TEXT_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- All Modals --- */}
      <DatePicker modal open={isDatePickerVisible} date={date} onConfirm={(newDate) => { setDatePickerVisible(false); setDate(newDate); }} onCancel={() => setDatePickerVisible(false)} />
      
      <PickerModal
        visible={isCategoryPickerVisible}
        onClose={() => setCategoryPickerVisible(false)}
        currentSelection={category}
        items={CATEGORIES}
        title="Select Category"
        onSelect={(selectedCategory) => {
          setCategory(selectedCategory);
          setCategoryPickerVisible(false);
        }}
      />
      
      <PickerModal
        visible={isPriorityPickerVisible}
        onClose={() => setPriorityPickerVisible(false)}
        currentSelection={priority}
        items={PRIORITIES}
        title="Select Priority"
        onSelect={(selectedPriority) => {
          setPriority(selectedPriority);
          setPriorityPickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

// --- Styles for all components ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: DARK_BG },
  container: { flex: 1, padding: 20, backgroundColor: DARK_BG },
  heading: { fontSize: 32, fontWeight: 'bold', color: NEON_BLUE, alignSelf: 'center', marginBottom: 30, textShadowColor: SHADOW_COLOR, textShadowRadius: 15, },
  label: { fontSize: 16, color: TEXT_COLOR, marginBottom: 8, marginTop: 15, opacity: 0.8 },
  input: { borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: TEXT_COLOR, backgroundColor: MODAL_BG, textAlignVertical: 'top' },
  inputButton: { borderWidth: 1, borderColor: BORDER_COLOR, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: MODAL_BG },
  buttonText: { color: TEXT_COLOR, marginLeft: 12, fontSize: 16 },
  reminderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  saveButton: { backgroundColor: NEON_BLUE, padding: 15, borderRadius: 12, marginTop: 40, alignItems: 'center', shadowColor: SHADOW_COLOR, shadowRadius: 15, shadowOpacity: 0.7, elevation: 8 },
  saveButtonText: { color: DARK_BG, fontSize: 18, fontWeight: 'bold' },
  
  // --- Modal Styles ---
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  pickerModalContent: { width: '85%', backgroundColor: MODAL_BG, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: BORDER_COLOR, shadowColor: SHADOW_COLOR, shadowRadius: 20, shadowOpacity: 1, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_COLOR, marginBottom: 15, textAlign: 'center' },
  pickerList: { marginTop: 10 },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  pickerText: { fontSize: 18, color: TEXT_COLOR, textAlign: 'center' },
  selectedPickerText: { color: NEON_BLUE, fontWeight: 'bold' }
});