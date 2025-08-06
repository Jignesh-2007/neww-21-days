import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryCard = ({ title, count, color, iconName, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { borderColor: color, shadowColor: color }]} onPress={onPress}>
      <Icon name={iconName} size={40} color={color} style={styles.icon} />
      <Text style={[styles.title, { color: color }]}>{title}</Text>
      <Text style={styles.countText}>{count} Tasks</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%', // Two cards per row with a small gap
    height: 150,
    backgroundColor: '#161b22',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  icon: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 14,
    color: '#a9a9a9',
  },
});

export default CategoryCard;