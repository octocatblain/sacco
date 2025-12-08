import { Link } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDataFetch } from "@/hooks/useDataFetch";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// types
import { LoanProps, TransactionProps } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const DashBoard = () => {
  const { totalCustomers, totalAccountBalance, totalLoans, totalWithdrawals } =
    useDashboardData();
  const { data: transactions } =
    useDataFetch<TransactionProps[]>("transactions");
  const { data: loans } = useDataFetch<LoanProps[]>("loans");

  // Normalize to arrays in case API returns single object or null
  const transactionsArray = Array.isArray(transactions)
    ? transactions
    : transactions
    ? ([transactions] as TransactionProps[])
    : [];
  const loansArray = Array.isArray(loans)
    ? loans
    : loans
    ? ([loans] as LoanProps[])
    : [];
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <Breadcrumb homePath="/" />
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAccountBalance}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Amount Withdrawn
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {totalLoans}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Recent activity */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent transactions.</CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              className="ml-auto gap-1 bg-primary text-black hover:opacity-90"
            >
              <Link to="/transactions">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsArray
                  .slice(0, 10)
                  .map((transaction: any, idx: any) => (
                    <TableRow
                      key={
                        transaction.transaction_id ??
                        `${transaction.account}-${
                          transaction.transaction_date ?? "unknown"
                        }-${idx}`
                      }
                    >
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.transaction_type}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell>
                        {transaction.transaction_date
                          ? (typeof transaction.transaction_date === "string"
                              ? new Date(transaction.transaction_date)
                              : transaction.transaction_date
                            ).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Recent Loans</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex justify-between gap-4 text-sm">
              <div>Account No.</div>
              <div>Status</div>
              <div>Amount</div>
            </div>
            {loansArray.slice(0, 10).map((loan: any, idx: any) => (
              <div
                key={
                  loan.loan_id ?? `${loan.account}-${loan.loan_status}-${idx}`
                }
                className="flex justify-between gap-4"
              >
                <div>{loan.account}</div>
                <div>
                  <Badge className="text-xs" variant="outline">
                    {loan.loan_status}
                  </Badge>
                </div>
                <div className="font-medium">{loan.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoard;
