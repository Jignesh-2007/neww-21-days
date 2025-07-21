import React from 'react';
import { SectionList, Text, View, StyleSheet } from 'react-native';

const Sectionl = () => {
  const DATA = [
    {
      title: 'Week Days',
      data: ['Monday', 'Tuesday', 'Wednesday','Thursday','Friday'],
    },
    {
      title: 'Weekends',
      data: ['Saturday', 'Sunday'],
    },
  ];

  return (
    <View>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingVertical: 15,
    alignItems:'center',
    alignContent:'center'
  },
  item: {
    fontSize: 16,
    paddingVertical: 5,
    paddingLeft: 10,
  },
});

export default Sectionl;
