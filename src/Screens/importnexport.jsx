import {Text,StyleSheet,View} from "react-native"
import React from "react";
import Stylles from "./src/Styyles/Stylles";

const App =()=>{
  return(
    <View>
      <Text style= {{fontWeight:"bold",TextAlign:"Center",lineHeight: 400,}}>Hello</Text>
      <Text style= {styles.Texx}>hi</Text>"
      <Text style= {styles.Texx2}>huihui</Text>
      <Text style= {Stylles.Text3}>haha</Text>
      <Text style= {{alignItems:"Center",flex:1,justifyContent:"Center"}}>yo</Text>
      <Text style= {{alignItems:"Center",flex:1,justifyContent:"Center",TextAlign:"Center"}}>hehe</Text>
    </View>
  )
}

const styles= StyleSheet.create(
{
 Texx:{ color:'black',fontSize: 30,fontWeight:'Bold'}
})

const Styles2= StyleSheet.create(
{
 Texx2:{ color:'purple',fontSize: 50}
}


)

export default App