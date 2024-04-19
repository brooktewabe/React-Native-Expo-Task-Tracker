import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isBuyer, setIsBuyer] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "https://galaxies.dev/img/logos/logo--blue.png"
  ); // Default profile picture
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }
    if (!password) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const options = [
    { label: "Buyer", value: true },
    { label: "Seller", value: false },
  ];

  const { onLogin, onRegister } = useAuth();

  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error) {
      // console.log(result.message);
    }
  };

  const register = async () => {
    if (validateForm()) {
      console.log("Submitted", email);
      setEmail("");
      setErrors({});
    }
    const result = await onRegister!(
      email,
      password,
      firstName,
      lastName,
      userName,
      confirmPassword,
      address,
      isBuyer,
      profilePic
    );
    if (result && result.error) {
      console.log(result.message);
    } else {
      login();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Image
          source={{ uri: "https://galaxies.dev/img/logos/logo--blue.png" }}
          style={styles.image}
        />
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
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text: string) => setUserName(text)}
            value={userName}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text: string) => setConfirmPassword(text)}
            value={confirmPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(text: string) => setAddress(text)}
            value={address}
          />
          {/* <TextInput
          style={styles.input}
          placeholder="Are you a buyer"
          onChangeText={(text: string) => setIsBuyer(text)}
          value={isBuyer}
        /> */}
          {/* <Image
            
              source={{ uri: profilePic }}
              style={styles.profilePic}
            /> */}
          <View style={styles.dropdownContainer}>
            <Text>Role:</Text>
            <RNPickerSelect
              items={options}
              onValueChange={(value) => setIsBuyer(value)}
              value={isBuyer}
            />
          </View>

          <Button title="Create Account" onPress={register} />
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
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  container: {
    alignItems: "center",
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
    flex: 1,
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
});

export default Signup;
