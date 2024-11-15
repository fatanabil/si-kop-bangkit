interface LoginServiceProps {
    username: string;
    password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const OnInitService = async () => {
    const response = await fetch(`${BASE_URL}/api/login`, { method: 'GET' });
    return { response };
};

export const CheckTokenIsVerified = async () => {
    const { token } = JSON.parse(localStorage.getItem('AUTH_DATA') as string);
    const response = await fetch(`${BASE_URL}/api/check-token`, { method: 'GET', headers: { authorization: token } });
    return { response };
};

export const LoginService = async ({ username, password }: LoginServiceProps) => {
    const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    return { response, result };
};
