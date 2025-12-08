import React, { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import LoginSvg from "@/assets/authenticate.svg";
import Logo from "@/assets/open-sacco.png";
import FormInput from "@/components/FormInput";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import { apiBaseUrl } from "@/constants";

const PasswordResetConfirm: FC = () => {
  const [inputType, setInputType] = useState("password");
  const [inputIcon, setInputIcon] = useState("EyeOff");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();

  // handle password visibility
  const handleIconClick = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
    setInputIcon((prev) => (prev === "EyeOff" ? "Eye" : "EyeOff"));
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 3000 });
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${apiBaseUrl}/api/password-reset-confirm/${uidb64}/${token}/`,
        {
          password,
        }
      );
      setLoading(false);
      toast.success("Password reset successful", { autoClose: 2000 });
      // redirect to login page
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(
        "Error resetting password. Please request for a new reset link",
        {
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-slate-700 dark:bg-blue-900 dark:text-slate-300">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <div className="hidden lg:flex h-full rounded-2xl flex-col justify-center items-center bg-white shadow-sm p-8 dark:bg-blue-950">
          <img
            src={LoginSvg}
            alt="Set new password"
            className="w-64 h-64 object-contain mb-6"
          />
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-semibold mb-2">Set a new password</h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Enter your new password to complete the reset process.
            </p>
          </div>
        </div>
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
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={confirmPassword}
                label="ConfirmPassword"
                icon={inputIcon}
                onIconClick={handleIconClick}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                text={loading ? <Spinner /> : "Reset Password"}
                type="submit"
                variant="secondary"
                className="mt-2 w-full"
              />
            </form>
            <div className="border border-slate-200 dark:border-slate-600 w-full mt-6 mb-3"></div>
            <p className="text-sm text-center">
              Request a new password reset?
              <Link className="ps-2 text-blue-700" to="/forgot-password">
                Reset now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
