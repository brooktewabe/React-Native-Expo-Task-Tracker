import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../context/AuthContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome";

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
  const [location, setLocation] = useState();
  const [mapClicked, setMapClicked] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!email) {
      errors.email = "Email is required.";
    } 
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }
    if (!password) errors.password = "Password is required";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!firstName) errors.firstName = "Required";
    if (!lastName) errors.lastName = "Required";

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
      login();
    }
  };
  Location.setGoogleApiKey("AIzaSyAymCFwSwX9TMrFGmhJrLAdZJdgLLVImSc");

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Please grant location permissions");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    let addressResponse = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    if (addressResponse.length > 0) {
      setAddress(addressResponse[0].city + ", " + addressResponse[0].country);
      console.log("Address:", address);
    } else {
      console.log("Address not found");
    }

    setMapClicked(true); // Set mapClicked to true after map icon is clicked
  };
  useEffect(() => {
    console.log("Updated Address:", address);
  }, [address]);
  return (
    // <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <SafeAreaView style={styles.container}>

        <View style={styles.form}>
          <View style={styles.row}>
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
              onChangeText={(text: string) => {
                setLastName(text) 
                setUserName(firstName + lastName)
              }
            }
              value={lastName}
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>
                {errors.lastName || errors.firstName}
              </Text>
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
          {/* <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text: string) => setUserName(text)}
            value={userName}
          /> */}
          {/* {errors.userName ? (
            <Text style={styles.errorText}>{errors.userName}</Text>
          ) : null} */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text: string) => setConfirmPassword(text)}
            value={confirmPassword}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
          <View style={styles.locationContainer}>
            <View style={styles.iconContainer}>
              <Icon
                name="map-marker"
                size={30}
                color="#900"
                onPress={getPermissions}
              />
            </View>
            <SafeAreaView style={styles.autocompleteContainer}>
              <GooglePlacesAutocomplete
                placeholder={
                  mapClicked ? `${address}` : "Type place or click map icon"
                }
                onPress={(data, details = null) => {
                  setAddress(data.description);
                }}
                query={{
                  key: "AIzaSyAymCFwSwX9TMrFGmhJrLAdZJdgLLVImSc",
                  // limit search results in Ethiopia
                  components: "country:et",
                  types: ["(cities)"],
                }}
                fetchDetails={true}
                onFail={(error) => console.log(error)}
                onNotFound={() => console.log("no results")}
                styles={{
                  container: {
                    flex: 0,
                  },
                }}
              />
            </SafeAreaView>
          </View>
          {errors.address ? (
            <Text style={styles.errorText}>{errors.address}</Text>
          ) : null}
          <Text>{``}</Text> 
          <Button title="Create Account" onPress={register} />
        </View>
      </SafeAreaView>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  form: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  NameInput: {
    height: 44,
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  dropdownContainer: {
    height: 50,
    justifyContent: "center",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  iconContainer: {
    width: "10%",
    alignItems: "center",
  },
  autocompleteContainer: {
    flex: 1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    // borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Signup;
