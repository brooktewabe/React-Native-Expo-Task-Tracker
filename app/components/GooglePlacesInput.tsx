import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome";

const App = () => {
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [mapClicked, setMapClicked] = useState(false);

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
      setAddress(addressResponse[0]);
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
            mapClicked
              ? `${address?.city}, ${address?.country}`
              : "Type a place or click map icon"
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
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  iconContainer: {
    justifyContent: "center",
    marginRight: 10,
  },
  autocompleteContainer: {
    flex: 1,
  },
});
