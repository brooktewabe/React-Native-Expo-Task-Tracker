import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
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

  const handleUpdateProfile = () => {
    const updatedUserInfo = { email, firstName, lastName, userName };
    axios.put(`${API_URL}/profile?id=${userData._id}`, updatedUserInfo)
      .then(response => {
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
        navigation.navigate('TodoList');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
      <Text>{``}</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First name"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUserName(text)}
            value={userName}
          />
          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
          <Button title="Update Account" onPress={handleUpdateProfile} />
          <TouchableOpacity onPress={() => navigation.navigate('TodoList')}>
            <Text style={styles.link}>Go to Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  form: {
    width: "60%",
    gap: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  successMessage: {
    color: 'green',
    alignSelf: 'center',
    marginTop: 10,
  },
  link: {
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    marginBottom: 10,
    color: '#00a3cc',
  },
});

export default UpdateProfileScreen;
