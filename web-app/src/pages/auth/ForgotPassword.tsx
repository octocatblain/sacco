import React, { FC, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

import Logo from "@/assets/open-sacco.png";
import ForgotPasswordSvg from "@/assets/forgot-password.png";
import { apiBaseUrl } from "@/constants";
// components
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${apiBaseUrl}/api/password-reset/`, { email });
      setLoading(false);
      toast.success(
        "Password reset email sent successfully. Please check your email",
        {
          autoClose: 4000,
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("Error sending password reset email. Enter valid email", {
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-slate-700 dark:bg-blue-900 dark:text-slate-300">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <div className="hidden lg:flex h-full rounded-2xl flex-col justify-center items-center bg-white shadow-sm p-8 dark:bg-blue-950">
          <img
            src={ForgotPasswordSvg}
            alt="Recover account"
            className="w-64 h-64 object-contain mb-6"
          />
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-semibold mb-2">
              Recover your account
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Provide your email and we'll send instructions to reset your
              password.
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
            <form className="space-y-4" onSubmit={handleEmailSubmit}>
              <FormInput
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                text={loading ? <Spinner /> : "Send Email"}
                type="submit"
                className="mt-2 w-full"
              />
            </form>
            <div className="border border-slate-200 dark:border-slate-600 w-full mt-6 mb-3"></div>
            <p className="text-sm text-center">
              Remembered your password?
              <Link className="ps-2 text-blue-700" to="/login">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
