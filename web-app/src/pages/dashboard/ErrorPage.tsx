import { FC } from "react";
import { Link, useRouteError } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RouteError {
  status: number;
  statusText: string;
  message: string;
}

const ErrorPage: FC = () => {
  const error = useRouteError() as RouteError;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon & Status */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
             <span className="text-[150px] font-black text-slate-900 dark:text-slate-100">
                {error?.status || "!"}
             </span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="h-24 w-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 ring-8 ring-white dark:ring-slate-900">
                 <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                 Something went wrong
             </h1>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                 {error?.statusText || error?.message || "An unexpected error occurred while processing your request."}
             </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
           <Button 
             variant="outline" 
             onClick={() => window.location.reload()}
             className="w-full sm:w-auto gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
           >
              <RefreshCcw className="h-4 w-4" />
              Try Again
           </Button>
           <Button 
             asChild 
             className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
           >
              <Link to="/dashboard">
                 <Home className="h-4 w-4" />
                 Back to Dashboard
              </Link>
           </Button>
        </div>
        
        <div className="text-xs text-slate-400 dark:text-slate-500 pt-8 border-t border-slate-100 dark:border-slate-800 mt-8">
            Tracking ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
