import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Text, Image, TextInput, TouchableOpacity, View, Alert, SafeAreaView, Button } from 'react-native';

const Useeff = () => {
    const [toggle, settoggle] = useState(true)

    return (
        <View style={{ alignContent: 'center', alignSelf: "center", alignItems: 'center', justifyContent: 'center', paddingTop: 400 }}>
            <Text style={{ color: 'red', fontSize: 20 }}>unmounting</Text>
            <Button title='Toggle' OnPress={() => settoggle(!toggle)} />
            {toggle === true ? <UserData /> : null}

        </View>
    )
}

const UserData = () => {
    useEffect(() => {
        const timer = setInterval(() => {
            console.log('timer running');
        }, 2000)
        return () => clearInterval(timer)
    },[])
    return (
        <View>
            <Text style={{ color: 'black', fontSize: 35 }}>Child Component</Text>
        </View>
    )
}
export default Useeff