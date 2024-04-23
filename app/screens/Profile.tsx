import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { API_URL } from "../context/AuthContext";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const UpdateProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');

  const userData = useSelector((state) => state.auth.userData);
  // const dispatch = useDispatch();

  const handleUpdateProfile = () => {
    const updatedUserInfo = {
      email,
      firstName,
      lastName,
      userName,
    };

    console.log('Updating profile with:', updatedUserInfo); 

    axios.put(`${API_URL}/profile?id=${userData.id}`, updatedUserInfo)
      .then(response => {
        console.log('Success', 'Profile updated successfully');
      })
      .catch(error => {
        console.log('Error', 'Failed to update profile');
        console.error('Error updating profile:', error);
      });
  };

  useEffect(() => {
    if (userData) {
      setEmail(userData.email || '');
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setUserName(userData.userName || '');
    }
  }, [userData]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First name"
            onChangeText={(text: string) => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            onChangeText={(text: string) => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text: string) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text: string) => setUserName(text)}
            value={userName}
          />
          <Button title="Update Account" onPress={handleUpdateProfile} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%", // Full width
    aspectRatio: 2, // Aspect ratio 2:1
    resizeMode: "contain",
  },
  form: {
    width: "60%",
    alignSelf: "center",
    marginTop: 20,
  },
  input: {
    height: 44,
    width:250,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },  
  NameInput: {
    height: 44,
    width:125,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  container: {
    alignItems: "center",
    // flexGrow: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 10,
  },
  dropdownContainer: {
    // flex: 1,
    // height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    padding: 5,
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 5,
  },
  autocompleteContainer: {
    flex: 1,
  },
});

export default UpdateProfileScreen;
