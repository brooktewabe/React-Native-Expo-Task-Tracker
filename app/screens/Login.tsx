import { View, Text, Image, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { onLogin } = useAuth();
  const navigation = useNavigation();
  const login = async () => {
    const result = await onLogin!(email, password);
    if (result && result.error) {
      setError(result.message);
  }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://galaxies.dev/img/logos/logo--blue.png' }} style={styles.image}></Image>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Sign In" onPress={login} />
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} ><Text style={styles.link}>Create Account</Text></TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  form: {
    gap: 10,
    width: "60%",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  link:{
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 35,
    marginRight: 35,
    marginTop: 0,
    marginBottom: 10,
    color: '#00a3cc'
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});

export default Login;
