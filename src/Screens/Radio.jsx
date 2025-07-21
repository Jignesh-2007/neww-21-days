import React, { use, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { StyleSheet, ImageBackground, Text, Image, TextInput, TouchableOpacity, View, Alert, SafeAreaView } from 'react-native';

const Radio = () => {
    const [radioselect,setradioselect]= useState(1)
    const studd = [
        {
            id: 1,
            nm: 'taib'
        },
        {
            id: 2,
            nm: 'Jignes'
        },
        {
            id: 3,
            nm: 'Jayes'
        }
    ]
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {studd.map((item) =>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.radioout} onPress={() => setradioselect(item.id)}>
                        {radioselect === item.id ?
                            <View style={styles.radioFill}>
                            </View> : null}
                    </TouchableOpacity>
                    <Text style={styles.textstyle}>{item.name}</Text>
                </View>
            )
            }
        </View>
    )
}
    export default Radio

    const styles = StyleSheet.create({
        radioout: {
            color: 'black',
            width: 30,
            height: 30,
            borderRadius: 15,
            borderColor: 'black',
            borderWidth: 2,
        },

        radioin: {
            color: 'black',
            width: 20,
            height: 20,
            borderRadius: 10,
            borderColor: 'black',
            borderWidth: 2,
            backgroundColor: 'black',
            margin: 3,
        },

    })