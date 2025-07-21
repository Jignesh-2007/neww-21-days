import { View, Text } from 'react-native'
import React, { useState } from 'react';

const Flexx = () => {

    return (

        <View style={{ flex: 1,backgroundColor:'pink', padding: 5 }}>



            <View style={{ flex: 1, flexDirection: 'row', }}>
                <View style={{ flex: 1, backgroundColor: 'green' }} />
                <View style={{ flex: 1, backgroundColor: 'red' }} />
                <View style={{ flex: 2, backgroundColor: 'blue' }} />
            </View>

            <View style={{ flex:1, flexDirection: 'row', }}>
                <View style={{ flex: 1, backgroundColor: 'pink'}} />
                <View style={{ flex: 1, backgroundColor: 'white'}} />


            </View>

            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'pink' }} />
                <View style={{ flex: 2, backgroundColor: 'black' }} />
                <View style={{ flex: 3, backgroundColor: 'yellow' }} />
            </View>

        </View>






    );
}
export default Flexx
