import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from 'react-redux';
import { loginSuccess, setUserData } from '../../store/authSlice';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email : string, password : string, firstName : string, lastName : string, userName : string, confirmPassword : string, address : string,isBuyer : boolean,profilePic : string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://143.198.168.244:3000/api/users";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const dispatch = useDispatch(); // call dispatch

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored token", token);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ 
            token: token,
            authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (email : string, password : string, firstName : string, lastName : string, userName : string, confirmPassword : string, address : string,isBuyer : boolean,profilePic : string) => {
    try {
      return await axios.post(`${API_URL}/register/v2`, { email, password, firstName, lastName, userName, confirmPassword, address,isBuyer,profilePic});
    } catch (e) {
      return { success: false, message: (e as any).response.data.message };
    }
  };
  
  const login = async (email: string, password: string, dispatch: any) => { // Pass dispatch as an argument
    try {
      const result = await axios.post(`${API_URL}/login`, { email, password });
      console.log("Login result:", result.data);
      // then store this data in redux store to be fetched for update
      dispatch(loginSuccess({ token: result.data.token }));
      dispatch(setUserData({ userData: result.data }));
      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
    }
  };
  
  const logout = async () => {
    // remove the token from Storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
    });
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    onRegister: register,
    onLogin: (email: string, password: string) => login(email, password, dispatch), // Pass dispatch to login
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
