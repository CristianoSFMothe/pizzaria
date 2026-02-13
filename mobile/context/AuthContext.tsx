import api from "@/services/api";
import { loginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [signed, setSigned] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await loadStorageData();
    };

    loadData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);

      const storedToken = await AsyncStorage.getItem("@token:pizzaria");

      const storedUser = await AsyncStorage.getItem("@user:pizzaria");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post<loginResponse>("/session", {
        email,
        password,
      });

      const { token, ...userData } = response.data;

      await AsyncStorage.setItem("@token:pizzaria", token);

      await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      if (error.response?.data?.error) {
        console.log(error.response?.data?.error);
      }
      console.log(error.message);
    }
  };

  const signOut = async () => {
    // await AsyncStorage.removeItem("@token:pizzaria");
    // await AsyncStorage.removeItem("@user:pizzaria");

    await AsyncStorage.multiRemove(["@token:pizzaria", "@user:pizzaria"]);

    setUser(null);
  };

  return (
    <AuthContext value={{ signed: !!user, loading, signIn, user, signOut }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
