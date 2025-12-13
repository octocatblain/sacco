"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountForm from "./AccountForm";

const FAKE_ACCOUNT: any = {
  account_number: 1001,
  customer: 1,
  account_type: "Savings",
  balance: 5000,
  status: "Active",
  interest_rate: 2.5,
  maturity_date: "2025-01-01",
  kyc_completed: true,
  id_document: "National ID",
};

const AccountsEdit = () => {
  const { accountNo } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Use fake data for demo
  const defaultValues = accountNo
    ? { ...FAKE_ACCOUNT, account_number: accountNo }
    : {};

  const handleSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/accounts");
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">
        {accountNo ? `Edit Account #${accountNo}` : "New Account"}
      </h1>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          Saving...
        </div>
      ) : (
        <AccountForm onSubmit={handleSubmit} defaultValues={defaultValues} />
      )}
    </div>
  );
};

export default AccountsEdit;
