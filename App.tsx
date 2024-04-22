import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/screens/Home";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/Signup";
import Profile from "./app/screens/Profile";
import { Provider } from "react-redux";
import store from "./store/store";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Layout></Layout>
      </AuthProvider>
    </Provider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight: () => (
                  <View style={styles.headerButtons}>
                    <Button onPress={onLogout} title="Sign Out" />
                  </View>
                ),
              }}
            />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              // options={{ headerShown: false }}
              component={Login}
            />
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
