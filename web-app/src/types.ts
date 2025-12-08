// export interface UserProps {
//   email: string;
//   username: string;
// }
// export interface ProfileProps {
//   id: string;
//   role: string;
//   profile_image: string;
//   user: UserProps;
// }

export type Profile = {
  role_display: string;
  profile_image: File;
};
export type UserProps = {
  username: string;
  email: string;
  profile: Profile;
};

export type CustomerProps = {
  id: number;
  salutation: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  email: string;
  date_of_birth: Date;
  
  kyc_status: "Verified" | "Pending" | "Rejected";
  created_at: Date;
  tax_number: string;
  country: string;
  county: string;
  city: string;
  po_box: number;
};

export type AccountProps = {
  account_number: number;
  account_type: "Savings" | "Current" | "Fixed" | "Joint" | "Corporate";
  status: "Active" | "Closed" | "Dormant" | "Suspended";
  balance: number;
  interest_rate: number;
  date_opened: Date;
  customer: number;
  customer_name?: string;
};

export type TransactionProps = {
  transaction_id: string;
  customer_id: string;
  transaction_type: "Deposit" | "Withdrawal" | "Transfer" | "Payment";
  amount: number;
  transaction_date: Date;
  description: string;
  account: number;
  served_by: string;
};

export type LoanProps = {
  loan_id: string;
  loan_type: "Personal" | "Development" | "Emergency" | "Education";
  loan_status: "Approved" | "Disbursed" | "Active" | "Closed";
  account: number;
  amount: number;
  loan_balance: number;
  date_approved: Date;
};

// types/auth.ts
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  last_login?: string;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}
