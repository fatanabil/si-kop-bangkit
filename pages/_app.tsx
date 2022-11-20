import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../contexts/authContext";
import { useState, useMemo } from "react";
import { AuthDataType } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  const [authData, setAuthData] = useState({
    username: "",
    token: "",
    isAuthenticated: false,
  });

  const changeAuthData = (newVal: AuthDataType) => {
    setAuthData((prevVal) => {
      return {
        ...prevVal,
        ...newVal,
      };
    });
  };

  const authDataContextValue = useMemo(() => {
    return {
      authData,
      changeAuthData,
    };
  }, [authData]);

  return (
    <AuthContextProvider value={authDataContextValue}>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
