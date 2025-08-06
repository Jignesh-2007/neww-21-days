import React from 'react';
import { StyleSheet, TouchableOpacity,View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Apps from './src/Screens/Apps';
import Profile from './src/Pages/Profile';
import Signup from './src/Pages/Signup';
import HomeScreen from './src/Pages/HomeScreen';
import LoginScreen from './src/Pages/LoginScreen';
import About from './src/Pages/About';
import Support from './src/Pages/Support';
import Focus from './src/Pages/Focus';
import Newtask from './src/Pages/Newtask';
import Progress from './src/Pages/Progress';
import Ai from './src/Pages/Ai';
import Gamification from './src/Pages/Gamification';
import UseReference from './src/Pages/UseReference';
import Work from './src/Pages/Work';
import School from './src/Pages/School';
import Sport from './src/Pages/Sport';
import Music from './src/Pages/Music';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // // <School/>
    // <Music/>
    // // <Sports/>

    //  <Gamification/>
    <NavigationContainer>
      <Stack.Navigator>                                                                                              
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
          title: 'WELCOME',
          headerTitleAlign: 'center',
          headerShown: false,
          headerStyle: {
            backgroundColor: 'black',
            shadowColor: 'grey',
            shadowOpacity: 0.5,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 25,
            color: 'white',
          }
        }} />

        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Button Pressed!')} style={{ marginRight: 10 }}>
              <Ionicons name="notifications" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerShown: false
        }} />
        <Stack.Screen name="Newtask" component={Newtask} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
        <Stack.Screen name="Progress" component={Progress} options={{ headerShown: false }} />
        <Stack.Screen name="Support" component={Support} options={{ headerShown: false }} />
        <Stack.Screen name="Focus" component={Focus} options={{ headerShown: false }} />
        <Stack.Screen name="Work" component={Work} options={{ headerShown: false }} />
        <Stack.Screen name="School" component={School} options={{ headerShown: false }} />
        <Stack.Screen name="Sport" component={Sport} options={{ headerShown: false }} />
         <Stack.Screen name="Music" component={Music} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Ai" component={Ai} options={{ headerShown: false }} /> */}
        {/* You can add this if needed */}
        {/* <Stack.Screen name="Gamification" component={Gamification} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    //{/* <UseReference/> */}
    // <Work/>
   


  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
