import { FC, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

import LoginSvg from "@/assets/authenticate.svg";
import Logo from "@/assets/open-sacco.png";
import { apiBaseUrl } from "@/constants";

const SignUp: FC = () => {
    const [inputType, setInputType] = useState<"password" | "text">("password");
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setInputType((prev) => (prev === "password" ? "text" : "password"));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!username || !email || !password || !password2) {
            toast.error("All fields are required");
            return;
        }

        if (password !== password2) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
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

            // Store tokens immediately upon successful registration
            localStorage.setItem("access_token", response.data.tokens.access);
            localStorage.setItem("refresh_token", response.data.tokens.refresh);
            
            // If the backend returns user data, store it too
            // Note: Adjust based on your actual backend response structure
             if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
             } else {
                 // Fallback or fetch user profile if needed
                 // For now, we assume registration auto-logins
             }


            setLoading(false);
            toast.success("Account created successfully! Welcome aboard.", { autoClose: 2000 });
            navigate("/dashboard");
        } catch (error: any) {
            setLoading(false);
            const errorMessage = 
                error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] ||
                error.response?.data?.password?.[0] ||
                error.response?.data?.detail || 
                "Error creating account. Please try again.";
            
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
                    <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center text-white max-w-lg">
                    <div className="w-64 h-64 mb-8 relative">
                        <img
                            src={LoginSvg}
                            alt="Sign Up Illustration"
                            className="w-full h-full object-contain filter drop-shadow-2xl animate-fade-in-up"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Join SLMS Today</h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Start your journey towards better financial management. <br />
                        Create an account to access powerful tools and insights.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="w-full max-w-md space-y-8 animate-fade-in my-auto">
                    {/* Logo & Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center p-2 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <img src={Logo} alt="SLMS Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Create your account
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fill in your details to get started
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSignup} className="mt-8 space-y-5">
                        <div className="space-y-4">
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
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative group">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={inputType}
                                        required
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 pr-10"
                                        placeholder="Create a password"
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

                            {/* Confirm Password Input */}
                             <div className="relative group">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={inputType}
                                        required
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 pr-10"
                                        placeholder="Confirm your password"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                    />
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Sign Up
                                    <UserPlus className="ml-2 h-4 w-4" />
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
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-colors"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
