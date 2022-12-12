import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useContext, FormEvent } from "react";
import Loader from "../components/loader";
import AuthContext from "../contexts/authContext";
import { ResponseJSONType } from "../types";
import URLS from "../utils/url";

interface LoginProps {
  baseURL: string;
}

export default function Login(props: LoginProps) {
  const router = useRouter();
  const { changeAuthData } = useContext(AuthContext);
  const [failed, setFailed] = useState<ResponseJSONType>({
    data: [],
    msg: "",
    err: false,
  });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLoginHandler = async (ev: FormEvent) => {
    ev.preventDefault();

    const login = await fetch(`${props.baseURL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await login.json();
    if (login.ok) {
      if (result.data.token) {
        const { username, token } = result.data;
        changeAuthData({ username, token, isAuthenticated: true });
        router.replace("/");
      }
    } else {
      if (result.err) {
        setFailed(result);
        setTimeout(() => {
          setFailed({ ...failed, err: false });
        }, 5000);
      }
    }
  };

  return (
    <>
      <Head>
        <title>SI-KOP-BANGKIT | Login</title>
      </Head>
      <div className="min-h-screen w-screen flex justify-center items-center bg-slate-800 px-6">
        <div className="w-full sm:w-2/3 md:w-2/5 lg:w-2/6 bg-slate-700 p-6 rounded-lg">
          <h1 className="text-center text-4xl font-semibold text-white">
            Login
          </h1>
          <hr className="my-6 border-2 border-slate-600 bg-none" />
          {failed.err && (
            <h1 className="text-red-400 before:content-['*_'] mb-3">
              {failed.msg}
            </h1>
          )}
          <form
            action=""
            className="flex flex-col"
            onSubmit={(ev) => onLoginHandler(ev)}
          >
            <div className="flex flex-col gap-3 mb-4">
              <label htmlFor="username" className="text-lg text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`bg-slate-600 rounded-md px-4 py-2 ${
                  failed.err
                    ? "text-red-400 focus:ring-red-400"
                    : "text-white focus:ring-slate-500"
                } outline-none focus:ring-2 transition-all`}
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                required={true}
              />
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <label htmlFor="password" className="text-lg text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`bg-slate-600 rounded-md px-4 py-2 ${
                  failed.err
                    ? "text-red-400 focus:ring-red-400"
                    : "text-white focus:ring-slate-500"
                } outline-none focus:ring-2 transition-all`}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required={true}
              />
            </div>
            <button
              type="submit"
              className="border-2 flex justify-center border-slate-600 bg-slate-700 py-2 rounded-md text-white hover:bg-slate-800 hover:border-slate-800 transition-all duration-200 mt-6 text-lg"
            >
              {loading ? <Loader /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      baseURL: URLS.BASE_URL,
    },
  };
}
