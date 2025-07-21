import React from "react";
import { View, Text, Button, Alert } from "react-native"

const Buttonns =()=>{


    return(
    <View>
     <Text style={{color:'Red',fontSize:20,lineHeight:40,fontStyle:"italic",lineHeight:130,textAlign:"left"}}>
        Here is the link to my YouTube Channel:   
    </Text>
        <Button title="Link" onPress={()=>Alert.alert("https://www.youtube.com/@reaperfps10")}/>
    </View>
    )
}


export default Buttonns