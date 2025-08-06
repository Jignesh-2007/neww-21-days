{/*import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const SimpleComponent = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [nameFocused, setNameFocused] = useState(false);

  const nameInputRef = useRef(null);

  const handleSubmit = () => {
    Alert.alert(
      'User Details',
      `Name: ${name}\nMobile: ${mobile}\nAddress: ${address}`
    );
    nameInputRef.current?.focus(); 
    setNameFocused(true); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={nameInputRef}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        onFocus={() => setNameFocused(true)}
        onBlur={() => setNameFocused(false)}
        style={[
          styles.input,
          nameFocused && styles.focusedInput
        ]}
      />
      <TextInput
        placeholder="Enter mobile number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  focusedInput: {
    borderColor: 'green',
    borderWidth: 2,
  },
});

export default SimpleComponent;
*/}


import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const SECTION_HEIGHT = Dimensions.get('window').height;

const CW = () => {
  const scrollRef = useRef(null);
  const [sectionPositions, setSectionPositions] = useState({});

  const handleLayout = (event, name) => {
    const { y } = event.nativeEvent.layout;
    setSectionPositions((prev) => ({ ...prev, [name]: y }));
  };

  const scrollToSection = (sectionName) => {
    const y = sectionPositions[sectionName];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Sections */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View onLayout={(e) => handleLayout(e, 'home')} style={[styles.section, { backgroundColor: '#FFDEE9' }]}>
          <Text style={styles.sectionText}>🏠 Welcome to Home</Text>
        </View>

        <View onLayout={(e) => handleLayout(e, 'about')} style={[styles.section, { backgroundColor: '#B5FFFC' }]}>
          <Text style={styles.sectionText}>ℹ About Us</Text>
        </View>

        <View onLayout={(e) => handleLayout(e, 'services')} style={[styles.section, { backgroundColor: '#D3F8E2' }]}>
          <Text style={styles.sectionText}>🛠 Our Services</Text>
        </View>

        <View onLayout={(e) => handleLayout(e, 'contact')} style={[styles.section, { backgroundColor: '#FBE4FF' }]}>
          <Text style={styles.sectionText}>📞 Contact Us</Text>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => scrollToSection('home')}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection('about')}>
          <Text style={styles.navText}>ℹ About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection('services')}>
          <Text style={styles.navText}>🛠 Services</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => scrollToSection('contact')}>
          <Text style={styles.navText}>📞 Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#222',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    height: SECTION_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CW;
