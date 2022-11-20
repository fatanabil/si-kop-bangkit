import { createContext } from "react";
import { AuthContextType } from "../types";

const defaultValue: AuthContextType = {
  authData: {
    username: "",
    token: "",
    isAuthenticated: false,
  },
  changeAuthData: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthContextProvider = AuthContext.Provider;

export default AuthContext;
