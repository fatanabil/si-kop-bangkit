import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Loader from "~/components/Loader";
import { api } from "~/utils/api";
import { loginFormSchema, type LoginFormSchema } from "../form/login";

const LoginPage = () => {
  const router = useRouter();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const {
    mutate: loginUser,
    isPending: isPendingLoginUser,
    error: loginError,
  } = api.auth.login.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  const handleLoginUser = (values: LoginFormSchema) => {
    loginUser(values);
  };

  return (
    <>
      <Head>
        <title>SI-KOP-BANGKIT | Login</title>
      </Head>
      <div className="flex min-h-screen w-screen items-center justify-center bg-slate-800 px-6">
        <div className="w-full rounded-lg bg-slate-700 p-6 sm:w-2/3 md:w-2/5 lg:w-2/6">
          <h1 className="text-center text-4xl font-semibold text-white">
            Login
          </h1>
          <hr className="my-6 border-2 border-slate-600 bg-none" />
          {loginError && (
            <h1 className="mb-3 text-red-400 before:content-['*_']">
              {loginError.message}
            </h1>
          )}
          <form
            method="POST"
            className="flex flex-col"
            onSubmit={handleSubmit(handleLoginUser)}
          >
            <div className="mb-4 flex flex-col gap-3">
              <label
                htmlFor="username"
                className={`text-lg ${errors.username || loginError ? "text-red-400" : "text-white"} transition-all`}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`rounded-md bg-slate-600 px-4 py-2 ${
                  errors.username || loginError
                    ? "text-red-400 focus:ring-red-400"
                    : "text-white focus:ring-slate-500"
                } outline-none transition-all focus:ring-2`}
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p className="text-red-400">* {errors.username.message}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col gap-3">
              <label
                htmlFor="password"
                className={`text-lg ${errors.password || loginError ? "text-red-400" : "text-white"} transition-all`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`rounded-md bg-slate-600 px-4 py-2 ${
                  errors.password || loginError
                    ? "text-red-400 focus:ring-red-400"
                    : "text-white focus:ring-slate-500"
                } outline-none transition-all focus:ring-2`}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-400">* {errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="mt-6 flex justify-center rounded-md border-2 border-slate-600 bg-slate-700 py-2 text-lg text-white transition-all duration-200 hover:border-slate-800 hover:bg-slate-800"
            >
              {isPendingLoginUser ? <Loader /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
