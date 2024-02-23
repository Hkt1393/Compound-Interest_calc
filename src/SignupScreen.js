import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import firebase from './firebase'; // Import your Firebase configuration

const AuthExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully logged in
        const user = userCredential.user;
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleSignup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully registered
        const user = userCredential.user;
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <Text>Password:</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default AuthExample;
