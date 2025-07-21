import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Support = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Support Us</Text>
      <Text style={styles.description}>
        If you enjoy using our app and want to support its development, consider making a small contribution.
      </Text>

      {/* Place your QR code here */}
      {/* <View style={styles.qrContainer}>
        <Image
          source={require('')}
          style={styles.qr}
          resizeMode="contain"
        />
      </View> */}
      <Text style={styles.or}>or</Text>
      <Text style={styles.other}>
        You can reach out to us for other ways to help!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 18,
  },
  description: {
    color: '#bfaaff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  qrContainer: {
    width: 180,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#eee',
  },
  qr: {
    width: 150,
    height: 150,
  },
  or: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 8,
  },
  other: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default Support;
