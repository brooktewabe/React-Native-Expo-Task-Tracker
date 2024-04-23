import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
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

// pagination and active status for the opened page
const PaginationButton: React.FC<{
  page: number;
  active: boolean;
  onPress: () => void;
}> = ({ page, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.paginationButton]}
    >
      <Text style={active && { fontWeight: "bold" }}>{page}</Text>
    </TouchableOpacity>
  );
};

const Home = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  // re-render on page change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ data: UserData[]; total: number }>(
          `${API_URL}/fetch/dummy/user-v2?page=${page}`
        );
        setUserData(response.data.data);
        setTotalPages(Math.ceil(response.data.total / 10)); // Assuming 10 items per page
      } catch (error) {
        console.error("Error, please reload:", error);
      }
    };
    fetchData();
  }, [page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      scrollToTop();
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          page={i}
          active={i === page}
          onPress={() => goToPage(i)}
        />
      );
    }
    return buttons;
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileContainer}>
        <Icon
          name="user-circle"
          size={30}
          onPress={() => navigation.navigate("Profile")}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {userData.map((user) => (
          <View key={user._id} style={styles.userContainer}>
            <Text
              style={styles.userName}
            >{`${user.firstName} ${user.lastName}`}</Text>
            <Image
              // source={{ uri: user.profilePic }}
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/120px-User-avatar.svg.png?20201213175635' }}
              style={styles.profilePic}
            />
            <Text>Email: {user.email}</Text>
            <Text>Username: {user.userName}</Text>
            <Text>Address: {user.address}</Text>
            {user.isBuyer && <Text>Buyer: Yes</Text>}
          </View>
        ))}
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={prevPage} disabled={page === 1}>
            <Text style={styles.paginationButton}>{"<"}</Text>
          </TouchableOpacity>
          {renderPaginationButtons()}
          <TouchableOpacity onPress={nextPage} disabled={page === totalPages}>
            <Text style={styles.paginationButton}>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  container: {
    paddingBottom: 100, // to make space for the pagination buttons
  },
  profileContainer: {
    alignItems: "flex-end",
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
  },
  activePaginationButton: {
    fontWeight: "bold",
  },
});

export default Home;
