import { FC } from "react";
import { Link, useRouteError } from "react-router-dom";
import Logo from "@/assets/open-sacco.png";

export interface RouteError {
  status: number;
  statusText: string;
  message: string;
}
const ErrorPage: FC = () => {
  const error = useRouteError() as RouteError;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-800 dark:bg-blue-900 dark:text-slate-200 px-4">
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-sm p-6 text-center dark:bg-blue-950">
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <img src={Logo} alt="SLMS logo" className="w-20 h-17" />
          <h1 className="text-2xl font-semibold tracking-tight">SLMS</h1>
          <p className="text-sm">Savings and Loan Management System</p>
        </div>

        <div className="rounded-md bg-primary/15 border border-primary/30 px-4 py-3 text-center">
          <h2 className="text-xl font-semibold mb-1">
            Oops! Something went wrong
          </h2>
          <p className="text-sm mb-2">
            Sorry, an unexpected error has occurred.
          </p>
          <p className="text-sm">
            <span className="font-medium">{error.status}</span>{" "}
            <span>{error.statusText || error.message}</span>
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-black hover:opacity-90"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
