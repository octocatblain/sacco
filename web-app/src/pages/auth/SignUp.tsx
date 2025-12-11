import { FC, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LoginSvg from "@/assets/authenticate.svg";
import Logo from "@/assets/open-sacco.png";
import { apiBaseUrl } from "@/constants";
// components
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

const SignUp: FC = () => {
  // TODO: manage input type and icon state independently and validate form input
  const [inputType, setInputType] = useState("password");
  const [inputIcon, setInputIcon] = useState("EyeOff");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();
  // handle password visibility
  const handleIconClick = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
    setInputIcon((prev) => (prev === "EyeOff" ? "Eye" : "EyeOff"));
  };

  // handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password and confirm password fields
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseUrl}/api/register/`, {
        username,
        email,
        password,
        password2,
      });

      // Store the token in local storage
      localStorage.setItem("access_token", response.data.tokens.access);
      localStorage.setItem("refresh_token", response.data.tokens.refresh);
      setLoading(false);
      toast.success("Account created successfully", { autoClose: 2000 });
      // Redirect to the dashboard
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error("Error creating account", { autoClose: 2000 });
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-slate-700 dark:bg-blue-900 dark:text-slate-300">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left brand panel */}
        <div className="hidden lg:flex h-full rounded-2xl flex-col justify-center items-center bg-white shadow-sm p-8 dark:bg-blue-950">
          <img
            src={LoginSvg}
            alt="Create account"
            className="w-64 h-64 object-contain mb-6"
          />
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-semibold mb-2">
              Create your SLMS account
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Join the Savings and Loan Management System to manage your
              savings, loans, and transactions.
            </p>
          </div>
        </div>
        {/* Right sign-up card */}
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
              <h3 className="pt-2 text-xl font-semibold">SLMS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Savings and Loan Management System
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSignup}>
              <FormInput
                type="text"
                name="Name"
                value={username}
                placeholder="Name"
                className=""
                label="Name"
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormInput
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type={inputType}
                name="password"
                placeholder="Password"
                value={password}
                label="Password"
                icon={inputIcon}
                onIconClick={handleIconClick}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormInput
                type={inputType}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={password2}
                label="ConfirmPassword"
                icon={inputIcon}
                onIconClick={handleIconClick}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <Button
                text={loading ? <Spinner /> : "Sign Up"}
                type="submit"
                className="mt-2 w-full"
              />
            </form>
            <div className="border border-slate-200 dark:border-slate-600 w-full mt-6 mb-3"></div>
            <p className="text-sm text-center">
              Already have an account?
              <Link className="ps-2 text-blue-700" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
