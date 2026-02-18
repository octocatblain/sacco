import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "react-toastify";

import LoginSvg from "@/assets/authenticate.svg";
import Logo from "@/assets/open-sacco.png";
import { apiBaseUrl } from "@/constants";

const SignIn: FC = () => {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiBaseUrl}/api/token/`, {
        username,
        password,
      });

      // Store tokens and user info
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setLoading(false);
      const successMessage = response.data.message || "Login successful";
      toast.success(successMessage, { autoClose: 2000 });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        "Invalid credentials";
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 dark:bg-blue-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900 opacity-90 pattern-grid-lg text-white/[0.05]" />
        
        {/* Abstract Circles Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
            <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center text-white max-w-lg">
          <div className="w-64 h-64 mb-8 relative">
            <img
              src={LoginSvg}
              alt="Login Illustration"
              className="w-full h-full object-contain filter drop-shadow-2xl animate-fade-in-up"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to SLMS</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline your Savings and Loan Management. <br/>
            Secure, efficient, and user-friendly.
          </p>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            {/* Logo & Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center p-2 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <img src={Logo} alt="SLMS Logo" className="w-full h-full object-contain" />
                 </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-5">
                {/* Username Input */}
                <div className="relative group">
                    <label 
                        htmlFor="username" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div className="relative group">
                    <div className="flex justify-between items-center mb-1">
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                        >
                            Password
                        </label>
                        <Link 
                            to="/forgot-password" 
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={inputType}
                            required
                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 pr-10"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                            onClick={togglePasswordVisibility}
                        >
                            {inputType === "password" ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

             {/* Divider */}
            <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 dark:bg-slate-900 text-gray-500">
                        Or continue with
                    </span>
                </div>
            </div>


            {/* Footer */}
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-colors"
            >
                Create an account
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
};

export default SignIn;
