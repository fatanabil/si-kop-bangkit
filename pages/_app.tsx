import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { AuthContextProvider } from "../contexts/authContext";
import "../styles/globals.css";
import { AuthDataType } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
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

  useEffect(() => {
    if (!authData.isAuthenticated) {
      router.replace("/login");
    }
  }, [authData.isAuthenticated]);

  return (
    <AuthContextProvider value={authDataContextValue}>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
