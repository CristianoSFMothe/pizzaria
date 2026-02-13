import React, { createContext } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [signed, setSigned] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const signIn = async (email: string, password: string) => {};

  return (
    <AuthContext value={{ signed, loading, signIn }}>{children}</AuthContext>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
