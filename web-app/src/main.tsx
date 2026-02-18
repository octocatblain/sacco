import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "./index.css";
// pages
import App from "./App.tsx";
import ErrorPage from "./pages/dashboard/ErrorPage.tsx";
import DashBoard from "./pages/dashboard/DashBoard.tsx";
// authentication
import SignIn from "./pages/auth/SignIn.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import PasswordResetConfirm from "./pages/auth/PasswordResetConfirm.tsx";
// public
import LandingPage from "./pages/public/LandingPage.tsx";

// customers
import Customers from "./pages/dashboard/customers/Customers.tsx";
import CustomersEdit from "./pages/dashboard/customers/CustomersEdit.tsx";
import CustomersView from "./pages/dashboard/customers/CustomersView.tsx";
// accounts
import Accounts from "./pages/dashboard/accounts/Accounts.tsx";
import AccountsEdit from "./pages/dashboard/accounts/AccoutsEdit.tsx";
import AccountsView from "./pages/dashboard/accounts/AccountsView.tsx";
// Transactions
import Transactions from "./pages/dashboard/transactions/Transactions.tsx";
import TransactionsEdit from "./pages/dashboard/transactions/TransactionsEdit.tsx";
import Settings from "./pages/dashboard/Settings.tsx";
import Loans from "./pages/dashboard/loans/Loans.tsx";
import Users from "./pages/dashboard/Users.tsx";
import Profile from "./pages/dashboard/settings/Profile.tsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.tsx";
import LoansEdit from "./pages/dashboard/loans/LoansEdit.tsx";
import LoansView from "./pages/dashboard/loans/LoansView.tsx";
import Arrears from "./pages/dashboard/loans/Arrears.tsx";
import Collections from "./pages/dashboard/loans/Collections.tsx";
import LoanAlerts from "./pages/dashboard/loans/Alerts.tsx";
import AdminProducts from "./pages/dashboard/savings/AdminProducts.tsx";
import UserContributions from "./pages/dashboard/savings/UserContributions.tsx";
import Help from "./pages/dashboard/Help.tsx";
import Notifications from "./pages/dashboard/Notifications.tsx";
import Onboarding from "./pages/dashboard/kyc/Onboarding.tsx";
import Applications from "./pages/dashboard/kyc/Applications.tsx";
import ChartOfAccounts from "./pages/dashboard/accounting/ChartOfAccounts.tsx";
import Journals from "./pages/dashboard/accounting/Journals.tsx";
import TrialBalance from "./pages/dashboard/accounting/TrialBalance.tsx";
import UserSettingsPage from "./pages/dashboard/settings/UserSettingsPage.tsx";
import MemberOnboarding from "./pages/dashboard/members/MemberOnboarding.tsx";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, // Landing page at root
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard", // Authenticated routes under /dashboard
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard", // This maps to /dashboard/
        element: <DashBoard />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "customers/edit/:customerId?",
        element: <CustomersEdit />,
      },
      {
        path: "customers/view/:customerId",
        element: <CustomersView />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "accounts/edit",
        element: <AccountsEdit />,
      },
      {
        path: "members/onboard",
        element: <MemberOnboarding />,
      },
      {
        path: "accounts/edit/:accountNo?",
        element: <AccountsEdit />,
      },
      {
        path: "accounts/view/:accountNo",
        element: <AccountsView />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "transactions/edit/:transactionId?",
        element: <TransactionsEdit />,
      },
      {
        path: "loans",
        element: <Loans />,
      },
      {
        path: "loans/edit/:loanId?",
        element: <LoansEdit />,
      },
      {
        path: "loans/view/:loanId",
        element: <LoansView />,
      },
      {
        path: "loans/arrears",
        element: <Arrears />,
      },
      {
        path: "loans/collections",
        element: <Collections />,
      },
      {
        path: "loans/alerts",
        element: <LoanAlerts />,
      },
      {
        path: "savings/products",
        element: <AdminProducts />,
      },
      {
        path: "savings/contributions",
        element: <UserContributions />,
      },
      {
        path: "settings/system",
        element: <Settings />,
      },
      {
        path: "settings/profile",
        element: <Profile />,
      },
      {
        path: "settings/user",
        element: <UserSettingsPage />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "kyc/onboarding",
        element: <Onboarding />,
      },
      {
        path: "kyc/applications",
        element: <Applications />,
      },
      {
        path: "accounting/chart-of-accounts",
        element: <ChartOfAccounts />,
      },
      {
        path: "accounting/journals",
        element: <Journals />,
      },
      {
        path: "accounting/trial-balance",
        element: <TrialBalance />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:uidb64/:token",
    element: <PasswordResetConfirm />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeContextProvider>
  </React.StrictMode>
);
