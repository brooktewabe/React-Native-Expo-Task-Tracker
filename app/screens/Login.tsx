import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TextInput, 
  Button, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image 
        source={{ uri: 'https://galaxies.dev/img/logos/logo--blue.png' }} 
        style={styles.image}
      />
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          onChangeText={(text: string) => setEmail(text)} 
          value={email} 
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry={true} 
          onChangeText={(text: string) => setPassword(text)} 
          value={password}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Sign In" onPress={login} />
        <TouchableOpacity onPress={() => navigation.navigate('Signup')} >
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "50%",
    height: "30%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  form: {
    gap: 10,
    width: "80%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  link: {
    fontSize: 16,
    textAlign: "center",
    color: "#00a3cc",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;
