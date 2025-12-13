"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AccountProps } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";

// Fake data for accounts
const FAKE_ACCOUNTS: any[] = [
  {
    account_number: 1001,
    customer: 1,
    customer_name: "Sipho Nkosi",
    account_type: "Savings",
    balance: 5000,
    status: "Active",
    date_opened: new Date("2023-01-01"),
  },
  {
    account_number: 1002,
    customer: 2,
    customer_name: "Wanjiku Mwangi",
    account_type: "Current",
    balance: 12000,
    status: "Active",
    date_opened: new Date("2023-02-01"),
  },
  {
    account_number: 1003,
    customer: 3,
    customer_name: "Thabo Mokoena",
    account_type: "Fixed",
    balance: 25000,
    status: "Dormant",
    date_opened: new Date("2023-03-01"),
  },
  {
    account_number: 1004,
    customer: 4,
    customer_name: "Achieng Odhiambo",
    account_type: "Retirement",
    balance: 80000,
    status: "Active",
    date_opened: new Date("2023-04-01"),
  },
  {
    account_number: 1005,
    customer: 5,
    customer_name: "Lerato Pule",
    account_type: "Joint",
    balance: 15000,
    status: "Suspended",
    date_opened: new Date("2023-05-01"),
  },
  {
    account_number: 1006,
    customer: 6,
    customer_name: "Kamau Njoroge",
    account_type: "Corporate",
    balance: 120000,
    status: "Closed",
    date_opened: new Date("2023-06-01"),
  },
];
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Accounts = () => {
  const [data, setData] = useState<AccountProps[]>(FAKE_ACCOUNTS);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    row: null as AccountProps | null,
  });

  const handleConfirm = (action: string, row: AccountProps) => {
    setConfirmDialog({ open: true, action, row });
  };
  const closeConfirm = () =>
    setConfirmDialog({ open: false, action: "", row: null });

  // For demo, only allow delete (removes row)
  const remove = (account_number: number) =>
    setData((prev) => prev.filter((r) => r.account_number !== account_number));

  const columns: ColumnDef<AccountProps>[] = [
    {
      accessorKey: "account_number",
      header: "Account Number",
      cell: ({ row }) => (
        <Link
          to={`/accounts/view/${row.original.account_number}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {row.original.account_number.toLocaleString()}
        </Link>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Member Name",
      cell: ({ row }) => row.original.customer_name || "N/A",
    },
    {
      accessorKey: "account_type",
      header: "Product",
      cell: ({ row }) => {
        const badges: Record<string, string> = {
          Savings: "bg-green-100 text-green-800",
          Voluntary: "bg-cyan-100 text-cyan-800",
          Fixed: "bg-purple-100 text-purple-800",
          Retirement: "bg-orange-100 text-orange-800",
          Joint: "bg-pink-100 text-pink-800",
          Corporate: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={badges[row.original.account_type] || "bg-gray-100"}>
            {row.original.account_type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => row.original.balance.toLocaleString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const colors: Record<string, string> = {
          Active: "text-green-600 bg-green-50",
          Dormant: "text-yellow-600 bg-yellow-50",
          Suspended: "text-orange-600 bg-orange-50",
          Closed: "text-red-600 bg-red-50",
        };
        return (
          <Badge className={colors[row.original.status] || "bg-gray-100"}>
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full p-1 border bg-white dark:bg-blue-900">
              <LucideIcon name="Pen" size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to={`/accounts/view/${row.original.account_number}`}>
                <LucideIcon name="Eye" size={16} className="mr-2" /> View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/accounts/edit/${row.original.account_number}`}>
                <LucideIcon name="Pen" size={16} className="mr-2" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`/loans/apply?account=${row.original.account_number}`}>
                <LucideIcon name="DollarSign" size={16} className="mr-2" />{" "}
                Apply Loan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleConfirm("Delete", row.original)}
            >
              <LucideIcon name="Trash2" size={16} className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb
          title="Member Accounts"
          description="Multi-product savings • Fixed • Voluntary • Retirement • Corporate"
          homePath="/"
        />

        <div className="flex gap-3">
          <Link
            to="/members/onboard"
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700"
          >
            Digital Onboarding
          </Link>
          <Link
            to="/accounts/edit"
            className="border px-5 py-2.5 rounded-lg hover:bg-gray-50"
          >
            Create Account
          </Link>
        </div>
      </div>

      <DataTable
        title="All Accounts"
        data={data ? data.flat() : []}
        columns={columns}
        filters="account_number,customer_name,account_type"
        searchable
        exportable
      />
      {/* Dialogs */}
      <Dialog open={confirmDialog.open} onOpenChange={closeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete account{" "}
              {confirmDialog.row?.account_number?.toLocaleString()} -{" "}
              {confirmDialog.row?.customer_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                if (confirmDialog.row) remove(confirmDialog.row.account_number);
                closeConfirm();
              }}
            >
              Yes
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
