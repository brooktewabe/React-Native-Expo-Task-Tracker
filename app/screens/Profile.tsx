import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { API_URL } from "../context/AuthContext";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUserData } from '../../store/authSlice';

const UpdateProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
   const dispatch = useDispatch();

  const navigation = useNavigation();

  const userData = useSelector((state) => state.auth.userData);
  // console.log('Redux Store Data:', userData);

  const handleUpdateProfile = () => {
    const updatedUserInfo = {
      email,
      firstName,
      lastName,
      userName,
    };

    console.log('Updating profile with:', updatedUserInfo); 

    axios.put(`${API_URL}/profile?id=${userData._id}`, updatedUserInfo)
      .then(response => {
        console.log('Success', 'Profile updated successfully');
        dispatch(setUserData({ userData: response.data }));

        setSuccessMessage('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setSuccessMessage('');
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
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage('');
        // Redirect to home screen
        navigation.navigate('Home');
      }, 2000); // Delay for 2 seconds
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);
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
           {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
          <Button title="Update Account" onPress={handleUpdateProfile} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  successMessage: {
    color: 'green',
    alignSelf: 'center',
    marginTop: 10,
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
