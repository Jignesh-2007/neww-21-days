import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';

 const DATABASE_URL = 'https://myapp-c38cf-default-rtdb.firebaseio.com/';
const URL = 'https://myapp-c38cf-default-rtdb.firebaseio.com/';

const Form = () => {
  const [form, setForm] = useState({
    name: '',
    college: '',
    department: '',
    rollNo: '',
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    college: '',
    department: '',
    rollNo: '',
  });

  const Change = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleEdit = (item) => {
    setEditForm({
      id: item.id,
      name: item.name,
      college: item.college,
      department: item.department,
      rollNo: item.rollNo,
    });
    setEditModalVisible(true);
  };



  const deleteItem = async (id) => {
    try {
      await axios.delete(`${URL}/users/${id}.json`);
      Alert.alert('Data deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      Alert.alert('Failed to delete');
    }
  };

  const Submit = async () => {
    if (!form.name || !form.college || !form.department || !form.rollNo) {
      Alert.alert('Please fill all fields!');
      return;
    }

    try {
      await axios.post(DATABASE_URL, form);
      Alert.alert('Data Submitted!');
      setForm({ name: '', college: '', department: '', rollNo: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to submit!');
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${URL}/users.json`);
      const data = res.data
        ? Object.entries(res.data).map(([id, value]) => ({ id, ...value }))
        : [];
      setSubmittedData(data.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Student Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={form.name}
        placeholderTextColor="#888"
        onChangeText={(text) => Change('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter College Name"
        value={form.college}
        placeholderTextColor="#888"
        onChangeText={(text) => Change('college', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Department"
        value={form.department}
        placeholderTextColor="#888"
        onChangeText={(text) => Change('department', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Roll No"
        keyboardType="numeric"
        value={form.rollNo}
        placeholderTextColor="#888"
        onChangeText={(text) => Change('rollNo', text)}
      />

      <TouchableOpacity style={styles.button} onPress={Submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.submittedHeading}>Submitted Data:</Text>
      {submittedData.map((item, index) => (
        <View key={index} style={styles.card}>
          <View>
            <Text>Name: {item.name}</Text>
            <Text>College: {item.college}</Text>
            <Text>Department: {item.department}</Text>
            <Text>Roll No: {item.rollNo}</Text>
          </View>
          <View style={styles.actionButtons}>
            <Button title="Edit" color="blue" onPress={() => handleEdit(item)} />
            <View style={{ width: 10 }} />
            <Button title="Delete" color="red" onPress={() => deleteItem(item.id)}/>
          </View>
        </View>
      ))}

    
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.heading}>Edit Student</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="College"
              value={editForm.college}
              onChangeText={(text) => setEditForm({ ...editForm, college: text })}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Department"
              value={editForm.department}
              onChangeText={(text) => setEditForm({ ...editForm, department: text })}
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Roll No"
              keyboardType="numeric"
              value={editForm.rollNo}
              onChangeText={(text) => setEditForm({ ...editForm, rollNo: text })}
              placeholderTextColor="#888"
            />

            <View style={styles.buttonRow}>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'skyblue',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submittedHeading: {
    fontSize: 20,
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
