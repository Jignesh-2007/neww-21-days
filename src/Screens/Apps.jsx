import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const Apps = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  const [students, setStudents] = useState([]);

  const firebaseURL = 'https://myapp-c38cf-default-rtdb.firebaseio.com/student.json'

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { name, contact, email, address } = form;
    if (!name || !contact || !email || !address) {
      Alert.alert('Error ❌', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${firebaseURL}/students.json`, form);
      const newStudent = { id: response.data.name, ...form };
      setStudents([...students, newStudent]);
      setForm({ name: '', contact: '', email: '', address: '' });
      Alert.alert('Success ✅', 'Data stored in Firebase!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error ❌', 'Failed to send data.');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${firebaseURL}/students.json`);
      const loaded = Object.entries(res.data || {}).map(([id, val]) => ({
        id,
        ...val,
      }));
      setStudents(loaded);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.heading}>Firebase Form</Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
        />
        <TextInput
          placeholder="Contact"
          style={styles.input}
          keyboardType="phone-pad"
          value={form.contact}
          onChangeText={(val) => handleChange('contact', val)}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
        />
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={form.address}
          onChangeText={(val) => handleChange('address', val)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.listHeading}>Stored Students</Text>
        {students.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <Text style={styles.studentText}>👤 {student.name}</Text>
            <Text>📞 {student.contact}</Text>
            <Text>✉ {student.email}</Text>
            <Text>📍 {student.address}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Apps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#00695c',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#80cbc4',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#00897b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeading: {
    fontSize: 18,
    marginBottom: 10,
    color: '#004d40',
    fontWeight: '600',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#b2dfdb',
    borderWidth: 1,
  },
  studentText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
