import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>About 21 Days</Text>

      {/* Intro Paragraph */}
      <Text style={styles.bodyText}>
        The name "21 Days" symbolizes the journey of building positive habits by consistently tracking your daily tasks. Our mission is to help you improve your lifestyle and stay updated on your goals every day.
      </Text>

      {/* Details Paragraph */}
      <Text style={styles.bodyText}>
        This project was developed at SUMAGO INFOTECH under the valuable guidance of Ravi Kandekar Sir, and is now ready to help you track and achieve your personal milestones.
      </Text>

      {/* Team Members */}
      <Text style={styles.subHeading}>Team Members:</Text>
      <Text style={styles.bodyText}>• Jignesh Shinde (Leader)</Text>
      <Text style={styles.bodyText}>• Taib Saiyad</Text>
      <Text style={styles.bodyText}>• Jayesh Chaudhari</Text>
      <Text style={styles.bodyText}>• Kunal Chaudhari</Text>
      <Text style={styles.bodyText}>• Darshan Patil</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: '#000',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#bfaaff',
    marginBottom: 16,
    textAlign: 'center',
    marginTop:80
  },
  subHeading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#bfaaff',
    marginTop: 40,
    marginBottom: 16
  },

  bodyText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    lineHeight: 22,
  }
});

export default About;
