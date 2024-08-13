import { SafeAreaView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import db, { initDatabase } from "./sqlite/sqlite";
import TodoList from "./app/screens/TodoList";
import Login from "./app/screens/Login";

export default function App() {

  useEffect(() => {
    initDatabase(db);
  }, []);
  return (
        <Layout />
  );
}
export const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? <TodoList /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
