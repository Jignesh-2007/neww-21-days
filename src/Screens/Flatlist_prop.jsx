import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';

const Flatlist_prop = () => {
    const Students = [
        {
            id: 1,
            Name: "Taib"
        },

        {
            id: 2,
            Name: "Jignes"
        },

        {
            id: 3,
            Name: "reaper"
        },

        {
            id: 4,
            Name: "Jayes"
        },
    ]

    const renderitems = ({ item }) => {
        return (
            <View style={{ justifyContent: "center", fontSize: 25, alignItems: "center" }}>
                <Text style={{ color: 'green', fontSize: 25 }}>{item.id}</Text>
                <Text style={{ color: 'green', fontSize: 25 }}>{item.name}</Text>

            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: "", alignContent: "center", alignItems: 'center' }} >
            <Text>Flatlist Example</Text>
            <FlatList
                data={Students}
                renderItem={renderitems}
                keyExtractor={item => item.id}

            />
        </View>
    )

}

export default Flatlist_prop;

const Userdata =(props)=>{
    const item = props.item 
    return(
        <View style={Styles.listcontainer}>
            <Text style={style.Textt}>{item.id}</Text>
            <Text style={style.Textt}>{item.Name}</Text>
        </View>
    )
}


const gharstyle=StyleSheet.create({
  Textt: {
    padding:10,
    fontSize:15,
    fontWeight:'bold',
    alignContent:'center',
  },

  containers:{
    margin: 40,
  }

})