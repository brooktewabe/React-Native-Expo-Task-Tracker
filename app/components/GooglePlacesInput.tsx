import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text, Image, StyleSheet, TextInput, Button } from "react-native";

const App = () => {
  return (
    <SafeAreaView>
      <GooglePlacesAutocomplete
        placeholder="Type a place"
        onPress={(data, details = null) => console.log(data, details)}
        query={{
          key: 'AIzaSyAymCFwSwX9TMrFGmhJrLAdZJdgLLVImSc'
        }}
        fetchDetails={true}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        styles={{
          container: {
            flex: 0,
          },
          description: {
            color: '#000',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#3caf50',
          },
        }}
      />
    </SafeAreaView>
  );
};
export default App