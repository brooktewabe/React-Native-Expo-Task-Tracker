import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useEffect } from "react";
import db, { initDatabase } from "./sqlite/sqlite";
import TodoList from "./app/screens/TodoList";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/Signup";
import Profile from "./app/screens/Profile";
import { Provider } from "react-redux";
import store from "./store/store";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase(db);
  }, []);
  return (
    <Provider store={store}>
      <AuthProvider>
        <Layout />
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
              name="TodoList"
              component={TodoList}
              options={({ navigation }) => ({
                headerTitle: "IE Tasks",
                headerRight: () => (
                  <View style={styles.headerButtons}>
                    <TouchableOpacity
                      style={styles.profileContainer}
                      onPress={() => navigation.navigate("Profile")}
                    >
                      <Icon
                        name="user-circle"
                        size={30}
                        style={styles.profileIcon}
                      />
                      {/* <Text style={styles.profileText}>Profile</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.logoutButton}
                      onPress={onLogout}
                    >
                      <Icon
                        name="sign-out"
                        size={30}
                        style={styles.logoutIcon}
                      />
                      {/* <Text style={styles.logoutText}>Logout</Text> */}
                    </TouchableOpacity>
                  </View>
                ),
              })}
            />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Stack.Navigator>
    //   <Stack.Screen name="IE Tasks" component={TodoList}  />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  profileIcon: {
    marginRight: 8,
  },
  profileText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
});
