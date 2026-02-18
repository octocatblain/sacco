import { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ShieldCheck, Users, BarChart3 } from "lucide-react";

import Logo from "@/assets/open-sacco.png";
import HeroImage from "@/assets/authenticate.svg";

const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
           <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center p-1">
                <img src={Logo} alt="SLMS Logo" className="w-full h-full object-contain" />
           </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            SLMS
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-transform transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="md:w-1/2 space-y-6 text-center md:text-left mb-12 md:mb-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-2">
            <span className="mr-2">🚀</span> New Generation Banking
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Manage your SACCO with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Confidence & Ease
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
            A comprehensive solution for Savings and Credit Cooperative Organizations. Track loans, savings, members, and transactions in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/help"
              className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center relative">
             {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            
            <img
                src={HeroImage}
                alt="Dashboard Preview"
                className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SLMS?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to run a modern, efficient, and compliant cooperative society.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-indigo-500" />}
              title="Secure & Reliable"
              description="Enterprise-grade security to keep your members' data and financial records safe and sound."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-blue-500" />}
              title="Member Management"
              description="Easily onboard, track, and manage member profiles, including KYC documents and account history."
            />
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10 text-teal-500" />}
              title="Real-time Analytics"
              description="Gain insights into your SACCO's performance with dynamic dashboards and financial reports."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
           <div className="flex items-center space-x-2 mb-4 md:mb-0">
               <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded flex items-center justify-center">
                    <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
               </div>
               <span className="font-semibold text-slate-700 dark:text-slate-300">SLMS</span>
           </div>
           
           <div className="text-sm text-slate-500 dark:text-slate-400">
             &copy; {new Date().getFullYear()} Open SACCO. All rights reserved.
           </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700/50">
    <div className="mb-4 bg-slate-50 dark:bg-slate-700/50 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
