import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import LoginSvg from "@/assets/authenticate.svg";
import Logo from "@/assets/open-sacco.png";
import { apiBaseUrl } from "@/constants";
// components
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const SignIn: FC = () => {
  // TODO: manage input type and icon state independently and validate form input
  const [inputType, setInputType] = useState("password");
  const [inputIcon, setInputIcon] = useState("EyeOff");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // toggle password visibility
  const handleIconClick = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
    setInputIcon((prev) => (prev === "EyeOff" ? "Eye" : "EyeOff"));
  };

  const navigate = useNavigate();

  // handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseUrl}/api/token/`, {
        username,
        password,
      });

      // Store the token in local storage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      setLoading(false);
      toast.success("Login successful", { autoClose: 2000 });
      // redirect to the dashboard
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error("Invalid credentials", { autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-slate-700 dark:bg-blue-900 dark:text-slate-300">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left brand panel (hidden on small screens) */}
        <div className="hidden lg:flex h-full rounded-2xl flex-col justify-center items-center bg-white shadow-sm p-8 dark:bg-blue-950">
          <img
            src={LoginSvg}
            alt="login"
            className="w-64 h-64 object-contain mb-6"
          />
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-semibold mb-2">Welcome to SLMS</h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Savings and Loan Management System. <br />
              Please sign in to continue.
            </p>
          </div>
        </div>

        {/* Right sign-in card */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-sm p-6 dark:bg-blue-950">
            <div className="mb-6 flex flex-col items-center">
              <div className="w-25 h-20">
                <img
                  src={Logo}
                  alt="SLMS logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="pt-2 text-3xl font-semibold">SLMS</h3>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Savings and Loan Management System
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <FormInput
                type="text"
                name="text"
                value={username}
                placeholder="Username"
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormInput
                type={inputType}
                name="password"
                value={password}
                placeholder="Password"
                label="Password"
                icon={inputIcon}
                onChange={(e) => setPassword(e.target.value)}
                onIconClick={handleIconClick}
              />
              <div className="flex justify-end items-center">
                <Link className="text-xs" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Button
                text={loading ? <Spinner /> : "Login"}
                type="submit"
                className="mt-2 w-full"
              />
            </form>
            <div className="border border-slate-200 dark:border-slate-600 w-full mt-6 mb-3"></div>
            <p className="text-sm text-center">
              Don't have an account?
              <Link className="ps-2 text-blue-700" to="/register">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
