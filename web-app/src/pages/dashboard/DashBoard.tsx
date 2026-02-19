import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  UserPlus,
  FileText,
  Wallet,
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
import Breadcrumb from "@/components/Breadcrumb";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashBoard = () => {
  // --- FAKE DATA ---
  const totalCustomers = 1234;
  const totalAccountBalance = 567890.12;
  const totalLoans = 43210.55;
  const totalWithdrawals = 12345.67;

  const transactionsArray = [
    { transaction_id: 1, account: "ACC1001", transaction_type: "Deposit", amount: 500.0, transaction_date: new Date().toISOString() },
    { transaction_id: 2, account: "ACC1002", transaction_type: "Withdrawal", amount: 200.0, transaction_date: new Date(Date.now() - 86400000).toISOString() },
    { transaction_id: 3, account: "ACC1003", transaction_type: "Deposit", amount: 1000.0, transaction_date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { transaction_id: 4, account: "ACC1004", transaction_type: "Loan Repayment", amount: 150.0, transaction_date: new Date(Date.now() - 3 * 86400000).toISOString() },
    { transaction_id: 5, account: "ACC1005", transaction_type: "Deposit", amount: 2500.0, transaction_date: new Date(Date.now() - 4 * 86400000).toISOString() },
  ];

  const loansArray = [
    { loan_id: 1, account: "ACC1001", loan_status: "Active", amount: 2500.0 },
    { loan_id: 2, account: "ACC1002", loan_status: "Pending", amount: 1500.0 },
    { loan_id: 3, account: "ACC1003", loan_status: "Closed", amount: 3000.0 },
    { loan_id: 4, account: "ACC1005", loan_status: "Active", amount: 5000.0 },
  ];

  const chartData = [
    { name: 'Jan', total: 45000 },
    { name: 'Feb', total: 52000 },
    { name: 'Mar', total: 48000 },
    { name: 'Apr', total: 61000 },
    { name: 'May', total: 55000 },
    { name: 'Jun', total: 67000 },
    { name: 'Jul', total: 72000 },
  ];
  // --- END FAKE DATA ---

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 animate-fade-in">
      <Breadcrumb homePath="/dashboard" />
      
      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <h2 className="text-lg font-semibold mr-auto">Overview</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9">
              <UserPlus className="h-4 w-4" /> 
              <span className="hidden sm:inline">New Member</span>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 h-9">
              <FileText className="h-4 w-4" /> 
              <span className="hidden sm:inline">New Application</span>
          </Button>
           <Button size="sm" variant="outline" className="gap-1.5 h-9">
              <Wallet className="h-4 w-4" /> 
              <span className="hidden sm:inline">Deposit</span>
          </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAccountBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawn
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalWithdrawals.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Portfolio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalLoans.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 active loans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-7">
        
        {/* Chart Section */}
        <Card className="xl:col-span-4" x-chunk="dashboard-01-chunk-4">
             <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                    Total asset growth over the last 7 months.
                </CardDescription>
             </CardHeader>
             <CardContent className="pl-0">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="name" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                         <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="total" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorTotal)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </CardContent>
        </Card>

        {/* Recent Loans */}
        <Card className="xl:col-span-3" x-chunk="dashboard-01-chunk-5">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Loans</CardTitle>
              <CardDescription>Latest loan applications and disbursements.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="ml-auto gap-1">
                <Link to="/loans">
                    View All <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
             {loansArray.map((loan) => (
              <div
                key={loan.loan_id}
                className="flex items-center gap-4"
              >
                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <FileText className="h-4 w-4" />
                 </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {loan.account}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loan.loan_status}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                    +${loan.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       {/* Recent Transactions Table */}
       <Card x-chunk="dashboard-01-chunk-6">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Overview of recent financial activities.</CardDescription>
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
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsArray.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell>
                          <div className="font-medium">{transaction.account}</div>
                      </TableCell>
                      <TableCell>
                           <Badge variant="outline" className="font-normal">
                               {transaction.transaction_type}
                           </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${transaction.transaction_type === 'Withdrawal' ? 'text-red-500' : 'text-green-600'}`}>
                          {transaction.transaction_type === 'Withdrawal' ? '-' : '+'}${transaction.amount}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                         {new Date(transaction.transaction_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
};

export default DashBoard;
