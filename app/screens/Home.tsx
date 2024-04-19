import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { API_URL } from "../context/AuthContext";

interface UserData {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  address: string;
  profilePic: string;
  isBuyer: boolean;
}

const Home = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: UserData[] }>(`${API_URL}/fetch/dummy/user-v2`);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {userData.map((user) => (
          <View key={user._id} style={styles.userContainer}>
            <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Username: {user.userName}</Text>
            <Text>Address: {user.address}</Text>
            <Text>Profile Picture: {user.profilePic}</Text>
            <Text>Buyer: {user.isBuyer ? "Yes" : "No"}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 10,
  },
  userContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default Home;
