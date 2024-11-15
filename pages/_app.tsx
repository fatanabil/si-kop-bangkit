import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
import { AuthContextProvider } from '../contexts/authContext';
import '../styles/globals.css';
import { AuthDataType } from '../types';
import { CheckTokenIsVerified } from '../services/auth-service';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [authData, setAuthData] = useState({
        username: '',
        token: '',
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
        const checkAuthUser = async () => {
            if (router.pathname !== '/login') {
                if (!localStorage.getItem('AUTH_DATA')) return router.push('/login');
                const { username, token, isAuthenticated } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);

                if (!token) {
                    return router.replace('/login');
                } else {
                    const { response } = await CheckTokenIsVerified();
                    if (!response.ok) {
                        return router.replace('/login');
                    } else {
                        setAuthData({ username, token, isAuthenticated });
                    }
                }
            }
        };

        checkAuthUser();
    }, [router]);

    return (
        <AuthContextProvider value={authDataContextValue}>
            <Component {...pageProps} />
        </AuthContextProvider>
    );
}
