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
  date_opened: Date;
  customer: number;
};

export type TransactionProps = {
  transaction_id: string;
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

// Loans lifecycle domain
export type Frequency = "monthly" | "weekly" | "daily";

export interface LoanScheduleItem {
  installmentNo: number;
  dueDate: string; // ISO date
  openingBalance: number;
  interest: number;
  principal: number;
  fees: number;
  totalDue: number;
  closingBalance: number;
  paid: boolean;
}

// Savings domain
export type SavingsProductType =
  | "voluntary"
  | "mandatory"
  | "retirement"
  | "custom";
export interface SavingsProduct {
  id: string;
  name: string;
  type: SavingsProductType;
  minContribution?: number;
  maxContribution?: number;
  interestRate?: number; // annual
  penaltyRule?: {
    lateFee?: number; // fixed amount
    penaltyRate?: number; // % of due amount
    graceDays?: number;
  };
  standingOrderAllowed?: boolean;
}

export interface StandingOrder {
  id: string;
  accountId: string;
  productId: string;
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface ContributionScheduleItem {
  id: string;
  date: string;
  dueAmount: number;
  paidAmount: number;
  outstanding: number;
  overdue: boolean;
}

export interface Contribution {
  id: string;
  accountId: string;
  productId: string;
  date: string;
  amount: number;
  method?: string;
  notes?: string;
}

// KYC / Onboarding domain
export type KycStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "need_more_info";

export type KycDocumentType =
  | "id_front"
  | "id_back"
  | "selfie"
  | "proof_of_address"
  | "other";

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  name: string; // original filename
  mimeType: string;
  size: number;
  url?: string; // object URL or CDN url after upload
}

export interface KycApplication {
  id: string;
  customerId?: string; // link to customer profile
  createdAt: string;
  updatedAt: string;
  status: KycStatus;
  personal: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dob: string; // ISO date
    nationalIdType: string; // e.g. ID, Passport
    nationalIdNumber: string;
    phone: string;
    email: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  risk?: {
    pep?: boolean;
    sanctionsHit?: boolean;
    riskScore?: number;
  };
  documents: KycDocument[];
  reviewer?: {
    assignedTo?: string; // user id or email
    reviewedAt?: string;
    decision?: "approved" | "rejected" | "need_more_info";
    notes?: string;
  };
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  date: string; // ISO
  method?: string;
  notes?: string;
}

export interface Guarantor {
  id: string;
  name: string;
  liability: number; // current guaranteed amount
  coGuarantor?: boolean;
}

export interface LoanAlert {
  id: string;
  loanId: string;
  type: "upcoming_due" | "overdue" | "low_balance" | "npl";
  message: string;
  createdAt: string; // ISO
}

export interface LoanDisbursement {
  id: string;
  loanId: string;
  amount: number;
  date: string; // ISO
  channel?: string;
}

// Notifications
export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
  createdAt: number; // epoch ms
  read: boolean;
}

// types/auth.ts
// Accounting domain
export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";

export type Account = {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  parent?: number | null;
  is_active: boolean;
  currency: string;
};

export type JournalLine = {
  id?: number;
  account: number;
  memo?: string;
  debit?: number;
  credit?: number;
};

export type JournalEntry = {
  id?: number;
  date: string;
  reference?: string;
  narration?: string;
  posted?: boolean;
  created_at?: string;
  updated_at?: string;
  lines: JournalLine[];
};

export type TrialBalanceRow = {
  account__id: number;
  account__code: string;
  account__name: string;
  account__type: AccountType;
  debit: number;
  credit: number;
  balance: number;
};
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
