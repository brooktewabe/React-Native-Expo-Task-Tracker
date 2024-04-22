import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


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
    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!firstName || !lastName) errors.firstName = "Required";
    if (!lastName) errors.lastName = "Required";
    if (!userName) errors.userName = "Username is required";
    if (!address) errors.address = "Address is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const { onRegister } = useAuth();

  const register = async () => {
    if (validateForm()) {
      console.log("Submitted", email);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setUserName("");
      setAddress("");
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
      // login();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.container}>

      <View style={styles.form}>
      <View style={styles.locationContainer}>

        <TextInput
          style={styles.NameInput}
          placeholder="First name"
          onChangeText={(text: string) => setFirstName(text)}
          value={firstName}
        />
        {errors.firstName ? (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        ) : null}
        <TextInput
          style={styles.NameInput}
          placeholder="Last name"
          onChangeText={(text: string) => setLastName(text)}
          value={lastName}
        />
        {errors.lastName ? (
          <Text style={styles.errorText}>{errors.lastName || errors.firstName}</Text>
        ) : null}
        </View>
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
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}

        <Button title="Update Account" onPress={register} />
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

export default Signup;
