import {Text,StyleSheet,View,Button} from "react-native"
import React,{useState} from 'react'

const App =()=>{
  const[name,setName] = useState('Taib')
  const UpdateValue =()=>{
    setName('Saiyad')
  }

  return(
    <View style = {{ alignItems:'center',flex:1,justifyContent:'center'}}>
      <Text style= {{fontWeight:"bold",fontSize:25}}>Name Change with: useState</Text>
     <Text style= {{fontWeight:"bold",fontSize:25,color:'red',lineHeight:60}}>{name}</Text>
    <Button title='Update Value' onPress={()=>UpdateValue()}/>
    </View>
  )
}


export default StateLearn