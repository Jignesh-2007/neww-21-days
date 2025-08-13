// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
// } from 'react-native';
// import auth from '@react-native-firebase/auth';
// // We no longer need the database SDK for saving, but we keep it for consistency if needed elsewhere
// import database from '@react-native-firebase/database';

// // Your Firebase Realtime Database URL
// const FIREBASE_DATABASE_URL = 'https://snapnotes-fd8f6-default-rtdb.firebaseio.com';

// const MainScreen = ({ navigation }) => {
//   const [notes, setNotes] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(setUser);
//     return subscriber;
//   }, []);

//   // This useEffect will now fetch notes using the URL when the user logs in
//   useEffect(() => {
//     const fetchNotes = async (currentUser) => {
//       try {
//         const idToken = await currentUser.getIdToken();
//         const url = `${FIREBASE_DATABASE_URL}/note/${currentUser.uid}.json?auth=${idToken}`;
        
//         const response = await fetch(url);
//         if (!response.ok) throw new Error("Failed to fetch notes.");

//         const data = await response.json();
//         const notesList = [];
//         if (data) {
//           for (let id in data) {
//             notesList.push({ id, ...data[id] });
//           }
//         }
//         setNotes(notesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//       } catch (error) {
//         console.error("Error fetching notes:", error);
//         setNotes([]);
//       }
//     };

//     if (user) {
//       fetchNotes(user);
//     } else {
//       setNotes([]);
//     }
//   }, [user]);

//   const handleLogout = () => {
//     auth()
//       .signOut()
//       .then(() => navigation.replace('LoginScreen'))
//       .catch(error => Alert.alert('Logout Error', error.message));
//   };

//   // This function now uses the POST method with your URL
//   const handleAddNote = async () => {
//     if (!title.trim()) {
//       Alert.alert('Title Required', 'Please enter a title for your note.');
//       return;
//     }
//     if (user) {
//       try {
//         // 1. Get an authentication token from the current user
//         const idToken = await user.getIdToken();

//         // 2. Create the full URL, including the user's ID and the auth token
//         const url = `${FIREBASE_DATABASE_URL}/note/${user.uid}.json?auth=${idToken}`;

//         const noteData = {
//           title: title.trim(),
//           description: description.trim(),
//           createdAt: new Date().toISOString(),
//         };

//         // 3. Send the data using the POST method
//         const response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(noteData),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Something went wrong');
//         }
        
//         // Manually add the new note to the list to show it instantly
//         const newNoteResponse = await response.json();
//         setNotes(prevNotes => [{ id: newNoteResponse.name, ...noteData }, ...prevNotes]);

//         setTitle('');
//         setDescription('');
//         setModalVisible(false);

//       } catch (error) {
//         console.error("Error saving note with POST:", error);
//         Alert.alert('Error', 'Failed to save note.');
//       }
//     }
//   };

//   const renderNote = ({ item }) => (
//     <View style={styles.noteCard}>
//       <Text style={styles.noteTitle}>{item.title}</Text>
//       {item.description ? <Text style={styles.noteDescription}>{item.description}</Text> : null}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>My Notes</Text>
//         <TouchableOpacity onPress={handleLogout}>
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={notes}
//         renderItem={renderNote}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No notes yet.</Text>
//             <Text style={styles.emptySubText}>Tap the '+' button to add one!</Text>
//           </View>
//         }
//       />

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => setModalVisible(true)}>
//         <Text style={styles.fabText}>+</Text>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add a New Note</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Title"
//               placeholderTextColor="#999"
//               value={title}
//               onChangeText={setTitle}
//             />
//             <TextInput
//               style={[styles.input, styles.descriptionInput]}
//               placeholder="Description (optional)"
//               placeholderTextColor="#999"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//             />
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => setModalVisible(false)}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.saveButton]}
//                 onPress={handleAddNote}>
//                 <Text style={styles.buttonText}>Save Note</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#121212',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   headerTitle: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   logoutButtonText: {
//     color: '#007AFF',
//     fontSize: 16,
//   },
//   listContainer: {
//     padding: 20,
//   },
//   noteCard: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   noteTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   noteDescription: {
//     color: '#B0B0B0',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   fab: {
//     position: 'absolute',
//     width: 60,
//     height: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//     right: 30,
//     bottom: 30,
//     backgroundColor: '#007AFF',
//     borderRadius: 30,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   fabText: {
//     fontSize: 30,
//     color: 'white',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#2C2C2E',
//     borderRadius: 20,
//     padding: 25,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     backgroundColor: '#3A3A3C',
//     borderRadius: 10,
//     padding: 15,
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginBottom: 15,
//   },
//   descriptionInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 10,
//   },
//   button: {
//     flex: 1,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#555',
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: '#007AFF',
//     marginLeft: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     color: '#B0B0B0',
//     fontSize: 18,
//   },
//   emptySubText: {
//     color: '#888',
//     fontSize: 14,
//     marginTop: 10,
//   },
// });

// export default MainScreen;
