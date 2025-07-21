import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const Mappping = () => {
  const Fruits = [
    {
      id: '1' ,
      Name: "WaterMelon"
    },

    {
      id: '2',
      Name: "Apple"
    },

    {
      id: '3',
      Name: "Kala Angur"
    },

    {
      id: '4',
      Name: "Kala Angur"
    },
    {
      id: '9',
      Name: "Kala Angur"
    },
    {
      id: '5',
      Name: "Kala Angur"
    },
    {
      id: '6',
      Name: "Kala Angur"
    },
    {
      id: '7',
      Name: "Kala Angur"
    },
    {
      id: '8',
      Name: "Kala Angur"
    },
  ];
return (
  <View style={styles.cont} >
    {
      Fruits.map((item => 
        <View key={(item.id)}> 
           <Text style={styles.sty}>{item.Name}</Text>

        </View>
      )
    )
    }
  </View>

)
}


export default Mappping;

const styles= StyleSheet.create({
sty:{
  fontSize:15,
  fontWeight:'bold',
  padding: 30,
  backgroundColor:'skyblue',
  height:100,
  width:100,
  margin:5,
},

cont:{
  flex:1,
  alignItems:'center',
  alignContent:'center',
  justifyContent:'center',
  flexDirection:'row',
  flexWrap:'wrap',
}

})