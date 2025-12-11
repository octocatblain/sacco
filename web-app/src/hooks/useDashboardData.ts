import {
  AccountProps,
  CustomerProps,
  LoanProps,
  TransactionProps,
} from "@/types";
import { useDataFetch } from "./useDataFetch";

export function useDashboardData() {
  const { data: customers } = useDataFetch<CustomerProps[]>("customers");
  const { data: accounts } = useDataFetch<AccountProps[]>("accounts");
  const { data: loans } = useDataFetch<LoanProps[]>("loans");
  const { data: transactions } =
    useDataFetch<TransactionProps[]>("transactions");

  // Normalize to arrays in case API returns a single object
  const customersArray = Array.isArray(customers)
    ? customers
    : customers
    ? ([customers] as CustomerProps[])
    : [];

  // Normalize to arrays in case API returns a single object
  const accountsArray = Array.isArray(accounts)
    ? accounts
    : accounts
    ? ([accounts] as AccountProps[])
    : [];
  const loansArray = Array.isArray(loans)
    ? loans
    : loans
    ? ([loans] as LoanProps[])
    : [];
  const transactionsArray = Array.isArray(transactions)
    ? transactions
    : transactions
    ? ([transactions] as TransactionProps[])
    : [];

  const totalCustomers = customersArray.length;

  const totalAccountBalance = accountsArray.reduce(
    (sum: number, account: AccountProps) => {
      const balance = typeof account.balance === "number" ? account.balance : 0;
      return sum + balance;
    },
    0
  );

  const totalLoans = loansArray.reduce((sum: number, loan: LoanProps) => {
    const amount = typeof loan.amount === "number" ? loan.amount : 0;
    return sum + amount;
  }, 0);

  const totalWithdrawals = transactionsArray.reduce(
    (sum: number, transaction: TransactionProps) => {
      const isWithdrawal =
        transaction.transaction_type?.includes("Withdrawal") ?? false;
      const amount =
        typeof transaction.amount === "number" ? transaction.amount : 0;
      if (isWithdrawal) {
        return sum + amount;
      }
      return sum;
    },
    0
  );
  return {
    totalCustomers,
    totalAccountBalance,
    totalLoans,
    totalWithdrawals,
  };
}
