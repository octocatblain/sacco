"use client";

import { useParams } from "react-router-dom";
// import { useFetchSingleObject } from "@/hooks/useFetchSingleObject";
// types
import {
  AccountProps,
  CustomerProps,
  LoanProps,
  TransactionProps,
} from "@/types";
// import { useDataFetch } from "@/hooks/useDataFetch";
// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";

const CustomersView = () => {
  const { customerId } = useParams();
  // Fakedata for customer details
  const customer: any = {
    id: customerId ? Number(customerId) : 1,
    first_name: "John",
    last_name: "Doe",
    middle_name: "M.",
    salutation: "Mr.",
    email: "john@example.com",
    phone_number: "0712345678",
    id_number: "12345678",
    tax_number: "A1234567",
    country: "Kenya",
    county: "Muranga",
    city: "Nairobi",
    po_box: 1234,
    date_of_birth: new Date("1990-01-01"),
  };
  const customerAccounts: any[] = [
    {
      account_number: 1001,
      customer: customer.id,
      account_type: "Savings",
      balance: 5000,
      status: "Active",
      date_opened: new Date("2023-01-01"),
    },
  ];
  const customerTransactions: any[] = [
    {
      transaction_id: "T-001",
      account: 1001,
      transaction_type: "Deposit",
      amount: 1000,
      transaction_date: new Date("2025-12-01"),
      description: "Deposit to savings",
      served_by: "admin",
    },
  ];
  const customerLoans: LoanProps[] = [
    {
      loan_id: "L-001",
      account: 1001,
      loan_type: "Personal",
      amount: 10000,
      loan_balance: 5000,
      loan_status: "Active",
      date_approved: new Date("2025-11-01"),
    },
  ];

  return (
    <div>
      <Breadcrumb
        title="Member Details"
        description="Profile, accounts, transactions and loans"
        homePath="/"
      />
      <div className="my-5 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-12 gap-8">
        <div className="col-span-3  space-y-8">
          <div className="bg-gray-200/50 p-5 rounded-md dark:bg-blue-900">
            <div className="font-medium">
              AccountNo: <span className="font-light">1234456</span>
            </div>
            <div className="font-medium">
              ID No: <span className="font-light">{customer?.id_number}</span>
            </div>
            <div className="font-medium">
              Salutation:{" "}
              <span className="font-light">{customer?.salutation}</span>
            </div>
            <div className="font-medium">
              First Name:{" "}
              <span className="font-light">{customer?.first_name}</span>
            </div>
            <div className="font-medium">
              First Name:{" "}
              <span className="font-light">{customer?.middle_name}</span>
            </div>
            <div className="font-medium">
              Last Name:{" "}
              <span className="font-light">{customer?.last_name}</span>
            </div>
            <div className="font-medium">
              Phone Number:{" "}
              <span className="font-light">{customer?.phone_number}</span>
            </div>
            <div className="font-medium">
              Email: <span className="font-light">{customer?.email}</span>
            </div>
            <div className="font-medium">
              Date of Birth:{" "}
              <span className="font-light">
                {customer?.date_of_birth.toString()}
              </span>
            </div>
            <div className="font-medium">
              Tax No: <span className="font-light">{customer?.tax_number}</span>
            </div>
          </div>
          <div className="bg-gray-200/50 p-5 rounded-md dark:bg-blue-900">
            <div className="font-medium">
              Country: <span className="font-light">{customer?.country}</span>
            </div>
            <div className="font-medium">
              County: <span className="font-light">Muranga</span>
            </div>
            <div className="font-medium">
              Ward: <span className="font-light">Kamacharia</span>
            </div>
            <div className="font-medium">
              City: <span className="font-light">{customer?.city}</span>
            </div>
            <div className="font-medium">
              P.O. Box: <span className="font-light">{customer?.po_box}</span>
            </div>
          </div>
        </div>
        <div className="col-span-9 space-y-8">
          <div className=" bg-gray-200/50 p-5 rounded-md dark:bg-blue-900">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <CardTitle>Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerAccounts.slice(0, 10).map((account) => (
                      <TableRow key={account.account_number}>
                        <TableCell>{account.account_number}</TableCell>
                        <TableCell>{account.account_type}</TableCell>
                        <TableCell>${account.balance}</TableCell>
                        <TableCell>
                          <Badge variant="outline"> {account.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className=" bg-gray-200/50 p-5 rounded-md dark:bg-blue-900">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <CardTitle>Transactions History</CardTitle>
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
                    {customerTransactions.slice(0, 10).map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell>{transaction.account}</TableCell>
                        <TableCell>{transaction.transaction_type}</TableCell>
                        <TableCell className="">
                          ${transaction.amount}
                        </TableCell>
                        <TableCell>
                          {transaction.transaction_date.toString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className=" bg-gray-200/50 p-5 rounded-md dark:bg-blue-900">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <CardTitle>Loan History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerLoans.length > 0 ? (
                      customerLoans.slice(0, 10).map((loan) => (
                        <TableRow key={loan.loan_id}>
                          <TableCell>{loan.account}</TableCell>
                          <TableCell>{loan.loan_type}</TableCell>
                          <TableCell>${loan.amount}</TableCell>
                          <TableCell>${loan.loan_balance}</TableCell>
                          <TableCell>{loan.loan_status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <div className="text-center">
                        <h1 className="text-2xl font-medium">
                          No loans history
                        </h1>
                      </div>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
