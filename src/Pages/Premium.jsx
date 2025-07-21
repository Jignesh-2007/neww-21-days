import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const PLANS = [
  {
    id: 'monthly',
    title: 'Monthly Plan',
    duration: '30-day full access',
    price: 100,
    originalPrice: 200,
    discountPercent: 50,
    features: [
      'Supporting the Developers',
      'Ads-Free Experience(Yes we have ads)',
      'Access to Customer Support',
    ],
    highlightColor: '#8E68F2', // Purple for monthly
    buttonColor: '#8572ee',
  },
  {
    id: 'yearly',
    title: 'Yearly Plan',
    duration: '1 year full access',
    price: 1200,
    originalPrice: 2400,
    discountPercent: 50,
    features: [
      'Supporting the Developers',
      'Ads-Free Experience(Yes we have ads)',
      'Access to Customer Support',
      'Please Buy it 🥲',
    ],
    highlightColor: '#EDAB41', // Orange for yearly
    buttonColor: '#EDAB41',
  },
];

const { width } = Dimensions.get('window');

const PlanCard = ({ item }) => (
  <View style={[styles.card, { borderColor: item.highlightColor }]}>
    <View style={styles.headerRow}>
      <Text style={[styles.title, { color: item.highlightColor }]}>
        {item.title}
      </Text>
      <Text style={styles.discount}>{item.discountPercent}% OFF</Text>
    </View>
    <Text style={styles.duration}>{item.duration}</Text>
    <View style={styles.priceRow}>
      <Text style={styles.price}>₹{item.price}.00</Text>
      <Text style={styles.originalPrice}>₹{item.originalPrice}.00</Text>
    </View>
    <View style={styles.features}>
      {item.features.map((feature, idx) => (
        <Text key={idx} style={styles.featureItem}>• {feature}</Text>
      ))}
    </View>
    <TouchableOpacity style={[styles.button, { backgroundColor: item.buttonColor }]}>
      <Text style={styles.buttonText}>
        {item.id === 'monthly' ? 'Start Monthly' : 'Start Yearly'}
      </Text>
    </TouchableOpacity>
  </View>
);

const Premium = () => (
  <View style={styles.container}>
    <Text style={styles.header}>21 DAYS PRO</Text>
    <FlatList
      data={PLANS}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={PlanCard}
      showsHorizontalScrollIndicator={false}
      snapToInterval={width * 0.9 + 16}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 8 }}
      pagingEnabled
      style={{ flexGrow: 0 }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151027',
    paddingTop: 50,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#211953',
    borderRadius: 20,
    borderWidth: 2,
    marginHorizontal: 8,
    padding: 24,
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#4B3052',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  duration: {
    marginTop: 8,
    fontSize: 15,
    color: '#bfaaff',
    marginBottom: 7,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  features: {
    marginTop: 10,
    marginBottom: 18,
  },
  featureItem: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Premium;
