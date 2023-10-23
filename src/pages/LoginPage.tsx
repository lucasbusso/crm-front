import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { mutate } from "swr";
import { authThunk } from "../redux/thunks/auth.thunk";
import { useUserContext } from "../context/register.context";
import { RegisterModal } from ".";
import { AuthCredentials } from "../interfaces/redux.interface";
import { useLoginContext } from "../context/login.context";

export const LoginPage: React.FC<{}> = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const [user, setUser] = useState<AuthCredentials>({
    email: "",
    password: "",
  });
  const { setRegister } = useUserContext();
  const { login, setLogin } = useLoginContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleSubmit() {
    dispatch(authThunk(user))
      .unwrap()
      .then((payload) => {
        if (payload !== undefined) {
          localStorage.setItem("token", payload?.token);
          navigate("/dashboard");
          setUser({ email: "", password: "" });
          mutate("/user");
        } else {
          setLogin(true);
        }
      })
      .catch(() => {
        navigate("/login");
      });
    navigate("/dashboard");
  }

  function handleLogin(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  return isAuth ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>
      <form className="container flex flex-column gap-4 w-[50%] mt-[64px]">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border-2 p-2 rounded-md"
          value={user.email}
          onChange={handleLogin}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border-2 p-2 rounded-md"
          value={user.password}
          onChange={handleLogin}
        />
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            variant="primary"
            className="bg-indigo-500 hover:bg-indigo-600 font-bold uppercase"
            onClick={() => handleSubmit()}
          >
            Login
          </Button>
          <Button
            type="button"
            variant="primery-outline"
            className=" hover:bg-slate-300 text-slate-500 font-bold uppercase"
            onClick={() => setRegister(true)}
          >
            Register
          </Button>
        </div>
      </form>
      {login ? <div>Login Error</div> : null}
      <RegisterModal />
    </>
  );
};
