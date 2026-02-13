import api from "@/services/api";
import { loginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [signed, setSigned] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

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

  return (
    <AuthContext value={{ signed, loading, signIn, user }}>
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
