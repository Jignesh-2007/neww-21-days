// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

// const Loging = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (email === '' || password === '') {
//       Alert.alert('Error', 'Please fill in all fields');
//     } else if (email === 'admin' && password === '1234') {
//       Alert.alert('Success', 'Login successful!');
//     } else {
//       Alert.alert('Failed', 'Invalid username or password');
//     }
//   };

//   return (
//     <View style={styles.main}>
//       <Text style={styles.heading}>Login</Text>
      

//       <TextInput
//         style={styles.inputBox}
//         placeholder='Username or Email'
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.inputBox}
//         placeholder='Password'
//         secureTextEntry={true}
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.buttonStyle} onPress={handleLogin}>
//         <Text style={styles.buttonText}>LOGIN</Text>
//       </TouchableOpacity>

//       <TouchableOpacity>
//         <Text style={styles.forgotText}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <View style={{ flexDirection: 'row', marginTop: 20 }}>
//         <Text style={styles.signText}>Don't have an account?</Text>
//         <TouchableOpacity>
//           <Text style={styles.signText1}> Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'skyblue',
//     padding: 20,
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: 'blue',
//     marginBottom: 30,
//   },
//   inputBox: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     paddingHorizontal: 20,
//     width: '80%',
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   buttonStyle: {
//     backgroundColor: 'blue',
//     padding: 12,
//     borderRadius: 5,
//     width: '80%',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   forgotText: {
//     fontSize: 14,
//     color: 'blue',
//     marginTop: 10,
//   },
//   signText: {
//     fontSize: 15,
//     color: 'black',
//   },
//   signText1: {
//     fontSize: 15,
//     color: 'blue',
//     fontWeight: '600',
//   },

// });


// export default Loging;
