import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';


import HomeScreen from './src/Pages/HomeScreen';
import LoginScreen from './src/Pages/LoginScreen';
import Work from './src/Pages/Work';
import School from './src/Pages/School';
import Music from './src/Pages/Music';
import Profile from './src/Pages/Profile';
import Newtask from './src/Pages/Newtask';
import Progress from './src/Pages/Progress';
import Focus from './src/Pages/Focus';
import Sport from './src/Pages/Sport';
import Ai from './src/Pages/Ai';
import Signup from './src/Pages/Signup';
import About from './src/Pages/About';

const Stack = createNativeStackNavigator();


const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#33ffff" />
  </View>
);

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);


  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  
  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
         
          <>

            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Newtask" component={Newtask} />
            <Stack.Screen name="Progress" component={Progress} />
            <Stack.Screen name="Work" component={Work} />
            <Stack.Screen name="School" component={School} />
            <Stack.Screen name="Sport" component={Sport} />
            <Stack.Screen name="Music" component={Music} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Focus" component={Focus} />
            <Stack.Screen name="Ai" component={Ai} />

          </>
        ) : (

          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Signup" component={Signup} />

            {/* You would typically have a way to navigate to a Signup screen from the LoginScreen itself */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1117',
  },
});

export default App;
