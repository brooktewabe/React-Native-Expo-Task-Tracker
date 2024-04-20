import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import { useNavigation } from "@react-navigation/native";
import Login from './app/screens/Login';
import SignUp from './app/screens/Signup';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth();
  // const navigation = useNavigation();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <Stack.Screen name="Home" component={Home}
            options={{
              headerRight: () => (
                <View style={styles.headerButtons}>
                  <Button onPress={() => console.log("Navigate to Profile")} title="Profile" style={styles.headerButton}/>
                  <Button onPress={onLogout} title='Sign Out'/>
                </View>
              ),
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 10,
  },
});
