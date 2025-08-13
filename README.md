This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


import React, { useState, useEffect } from 'react';

import {

  View,

  Text,

  StyleSheet,

  ImageBackground,

  TouchableOpacity,

  ScrollView,

  FlatList,

  SafeAreaView,

} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Ionicons from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';

import database from '@react-native-firebase/database';



// =================================================================

// --- THE FINAL FIX IS HERE ---

// The 'screen' names now EXACTLY MATCH the names in your App.js file.

// =================================================================

const initialCategories = [

  { id: '1', name: 'Work', screen: 'Work', color: '#1f2a47', icon: 'briefcase-outline', iconColor: '#33ffff' },

  { id: '2', name: 'School', screen: 'School', color: '#2c1d42', icon: 'school-outline', iconColor: '#ff33ff' },

  { id: '3', name: 'Sport', screen: 'Sport', color: '#1a3a3a', icon: 'barbell-outline', iconColor: '#39ff14' },

  { id: '4', name: 'Music', screen: 'Music', color: '#3d243c', icon: 'musical-notes-outline', iconColor: '#f7b3ff' },

];



const HomeScreen = ({ navigation }) => {

  const [userName, setUserName] = useState('User');

  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [categories, setCategories] = useState(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));

  

  useEffect(() => {

    const authSubscriber = auth().onAuthStateChanged((user) => {

      if (user) {

        const profileRef = database().ref(/users/${user.uid}/profile);

        const onProfileValueChange = profileRef.on('value', snapshot => {

          const userData = snapshot.val();

          if (userData && userData.username) {

            setUserName(userData.username);

          }

        });



        const tasksRef = database().ref(/users/${user.uid}/tasks);

        const onTasksValueChange = tasksRef.on('value', snapshot => {

          const tasksData = snapshot.val();

          

          if (tasksData) {

            const allTasks = Object.values(tasksData);

            

            let totalCompleted = 0;

            const newCategoryData = initialCategories.map(category => {

                const tasksForCategory = allTasks.filter(task => task.category === category.name);

                const completedInCategory = tasksForCategory.filter(task => task.completed).length;

                totalCompleted += completedInCategory;

                return {

                    ...category,

                    taskCount: tasksForCategory.length,

                };

            });



            setCategories(newCategoryData);

            const totalTasks = allTasks.length;

            setCompletionPercentage(totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0);



          } else {

            setCategories(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));

            setCompletionPercentage(0);

          }

        });



        return () => {

          profileRef.off('value', onProfileValueChange);

          tasksRef.off('value', onTasksValueChange);

        };



      } else {

        setUserName('Guest');

        setCategories(initialCategories.map(cat => ({ ...cat, taskCount: 0 })));

        setCompletionPercentage(0);

      }

    });



    return authSubscriber;

  }, []);



  const totalTasks = categories.reduce((sum, category) => sum + category.taskCount, 0);



  const navigateToProfile = () => navigation.navigate('Profile');

  const navigateToProgress = () => navigation.navigate('Progress');

  const navigateToNewTask = () => navigation.navigate('Newtask');

  const navigateToFocus = () => navigation.navigate('Focus');

  

  const navigateToCategory = (screenName) => {

    navigation.navigate(screenName);

  };



  return (

    <SafeAreaView style={styles.safeArea}>

      <ImageBackground

        source={require('../../assets/neonn.jpg')}

        style={{ flex: 1 }}

        imageStyle={{ opacity: 0.7 }}

        resizeMode='cover'

      >

        <ScrollView style={styles.scrollView}>

          <View style={styles.container}>

            <View style={styles.header}>

              <Text style={styles.headerTitle}>Hey {userName}!</Text>

              <TouchableOpacity onPress={navigateToProfile}>

                <View style={styles.avatar} />

              </TouchableOpacity>

            </View>



            <View style={styles.taskCard}>

              <View>

                <Text style={styles.taskCardTitle}>

                  {totalTasks > 0

                    ? ${totalTasks} Task${totalTasks > 1 ? 's' : ''} for today

                    : 'No tasks for today'}

                </Text>

                <TouchableOpacity style={styles.viewButton} onPress={navigateToProgress}>

                  <Text style={styles.viewButtonText}>View Tasks</Text>

                </TouchableOpacity>

              </View>

              <View style={styles.progressCircle}>

                <Text style={styles.percentText}>{completionPercentage}%</Text>

              </View>

            </View>



            <Text style={styles.sectionTitle}>Categories</Text>

            <FlatList

              data={categories}

              horizontal

              showsHorizontalScrollIndicator={false}

              renderItem={({ item }) => (

                <TouchableOpacity 

                  onPress={() => navigateToCategory(item.screen)}

                  style={[styles.categoryCard, { backgroundColor: item.color, shadowColor: item.iconColor, borderColor: item.iconColor }]}

                >

                  <Ionicons name={item.icon} size={30} color={item.iconColor} style={[styles.iconShadow, { shadowColor: item.iconColor }]} />

                  <Text style={[styles.categoryTitle, { color: item.iconColor, textShadowColor: item.iconColor }]}>{item.name}</Text>

                  <Text style={[styles.categoryTasks, { color: item.iconColor, textShadowColor: 'transparent' }]}>{item.taskCount} Tasks</Text>

                </TouchableOpacity>

              )}

              keyExtractor={(item) => item.id}

            />



            <View style={styles.tasksHeaderRow}>

              <Text style={styles.sectionTitle}>All Tasks</Text>

              <TouchableOpacity onPress={navigateToProgress}>

                <Text style={styles.seeAllText}>See All</Text>

              </TouchableOpacity>

            </View>



            <Text style={styles.footerText}>

              {totalTasks === 0 ? "No tasks yet! Start your journey by adding your first goal — your future self will thank you." : "Keep up the great work!"}

            </Text>

          </View>

        </ScrollView>



        <View style={styles.navbar}>

            <TouchableOpacity style={styles.navItem}>

              <Ionicons name="home" size={28} color="#33ffff" style={[styles.iconShadow, { shadowColor: '#33ffff' }]} />

              <Text style={[styles.navText, { color: '#33ffff' }]}>Home</Text>

            </TouchableOpacity>



            <TouchableOpacity style={styles.navItem} onPress={navigateToProgress}>

              <MaterialCommunityIcons name="progress-check" size={28} color="#fff" />

              <Text style={styles.navText}>Progress</Text>

            </TouchableOpacity>



            <TouchableOpacity style={styles.addButton} onPress={navigateToNewTask}>

              <Ionicons name="add" size={32} color="#0d1117" />

            </TouchableOpacity>



            <TouchableOpacity style={styles.navItem} onPress={navigateToFocus}>

              <Ionicons name="timer-outline" size={28} color="#fff" />

              <Text style={styles.navText}>Focus</Text>

            </TouchableOpacity>



            <TouchableOpacity style={styles.navItem} onPress={navigateToProfile}>

              <Ionicons name="person-outline" size={28} color="#fff" />

              <Text style={styles.navText}>Profile</Text>

            </TouchableOpacity>

        </View>

      </ImageBackground>

    </SafeAreaView>

  );

};



const NEON_BLUE = '#33ffff';

const DARK_BG = '#0d1117'; 



const styles = StyleSheet.create({

  safeArea: {

    flex: 1,

    backgroundColor: DARK_BG,

  },

  scrollView: {

    flex: 1,

  },

  container: {

    flex: 1,

    paddingHorizontal: 20,

    paddingBottom: 100, 

  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingTop: 10,

    paddingBottom: 10,

  },

  headerTitle: {

    color: '#fff',

    fontSize: 28,

    fontFamily: 'Valorax-lg25V',

    textShadowColor: 'rgba(255, 255, 255, 0.3)',

    textShadowOffset: { width: 0, height: 0 },

    textShadowRadius: 8,

  },

  avatar: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: '#161b22',

    borderColor: NEON_BLUE,

    borderWidth: 1,

  },

  taskCard: {

    backgroundColor: '#161b22',

    borderRadius: 20,

    padding: 20,

    marginTop: 20,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    borderColor: NEON_BLUE,

    borderWidth: 1,

    shadowColor: NEON_BLUE,

    shadowOffset: { width: 0, height: 0 },

    shadowOpacity: 0.8,

    shadowRadius: 10,

    elevation: 15,

  },

  taskCardTitle: {

    fontWeight: 'bold',

    fontSize: 19,

    color: '#fff',

  },

  viewButton: {

    backgroundColor: NEON_BLUE,

    paddingVertical: 8,

    paddingHorizontal: 16,

    borderRadius: 10,

    alignSelf: 'flex-start',

    marginTop: 10,

  },

  viewButtonText: {

    color: DARK_BG,

    fontWeight: 'bold',

  },

  progressCircle: {

    width: 70,

    height: 70,

    borderRadius: 35,

    borderWidth: 5,

    borderColor: NEON_BLUE,

    justifyContent: 'center',

    alignItems: 'center',

    shadowColor: NEON_BLUE,

    shadowOffset: { width: 0, height: 0 },

    shadowOpacity: 1,

    shadowRadius: 10,

  },

  percentText: {

    color: '#fff',

    fontWeight: 'bold',

    fontSize: 16,

  },

  sectionTitle: {

    color: '#fff',

    fontSize: 20,

    fontWeight: 'bold',

    marginTop: 30,

    marginBottom: 10,

    textShadowColor: 'rgba(255, 255, 255, 0.3)',

    textShadowOffset: { width: 0, height: 0 },

    textShadowRadius: 8,

  },

  categoryCard: {

    width: 130,

    height: 130,

    borderRadius: 15,

    marginRight: 15,

    padding: 15,

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    borderWidth: 1.5,

    shadowOffset: { width: 0, height: 0 },

    shadowOpacity: 0.9,

    shadowRadius: 8,

    elevation: 10,

  },

  categoryTitle: {

    fontSize: 18,

    fontWeight: 'bold',

    textShadowOffset: { width: 0, height: 0 },

    textShadowRadius: 8,

  },

  categoryTasks: {

    fontSize: 14,

    opacity: 0.8,

  },

  tasksHeaderRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  seeAllText: {

    color: NEON_BLUE,

    fontWeight: 'bold',

    fontSize: 19,

    marginTop: 10

  },

  footerText: {

    color: '#a9a9a9',

    textAlign: 'center',

    marginTop: 40,

    paddingHorizontal: 20,

    fontSize: 14,

    lineHeight: 22,

  },

  navbar: {

    position: 'absolute',

    bottom: 10,

    left: 20,

    right: 20,

    height: 70,

    backgroundColor: '#161b22',

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    borderRadius: 20,

    paddingHorizontal: 10,

    borderWidth: 1,

    borderColor: 'rgba(51, 255, 255, 0.3)',

  },

  navItem: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

  },

  navText: {

    color: '#a9a9a9',

    fontSize: 12,

    marginTop: 4,

  },

  addButton: {

    backgroundColor: NEON_BLUE,

    width: 60,

    height: 60,

    borderRadius: 30,

    justifyContent: 'center',

    alignItems: 'center',

    bottom: 20,

    shadowColor: NEON_BLUE,

    shadowOffset: { width: 0, height: 5 },

    shadowOpacity: 0.8,

    shadowRadius: 10,

    elevation: 10,

    borderColor: '#fff',

    borderWidth: 2,

  },

  iconShadow: {

    textShadowColor: NEON_BLUE,

    textShadowOffset: { width: 0, height: 0 },

    textShadowRadius: 10,

  }

});



export default HomeScreen;





