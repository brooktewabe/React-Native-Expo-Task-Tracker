import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  SafeAreaView,
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
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text: string) => setUserName(text)}
          value={userName}
        />
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}
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
    // </ScrollView>
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
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  NameInput: {
    height: 44,
    width: 125,
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
