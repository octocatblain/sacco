"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LucideIcon from "@/components/LucideIcon";
import { TransactionProps } from "@/types";

const columns: ColumnDef<any>[] = [
  {
    header: "Transaction ID",
    accessorKey: "transaction_id",
  },
  {
    header: "Customer ID",
    accessorKey: "customer_id",
    cell: ({ row }) => (
      <Link to={`/customers/view/${row.original.customer_id}`}>
        {row.original.customer_id}
      </Link>
    ),
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "transaction_type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>KES {row.original.amount.toLocaleString()}</span>,
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" className="rounded-full">
            <LucideIcon name="Pen" className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => row.original.onView?.()}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => row.original.onEdit?.()}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => row.original.onDelete?.()}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const FAKE_TRANSACTIONS: any[] = [
  {
    transaction_id: "T-001",
    customer_id: "CU-001",
    account: "AC-001",
    transaction_type: "Deposit",
    amount: 1000,
    transaction_date: "2025-12-01",
    status: "Completed",
    reference: "MP123456",
    notes: "Initial deposit via M-Pesa.",
  },
  {
    transaction_id: "T-002",
    customer_id: "CU-002",
    account: "AC-002",
    transaction_type: "Withdrawal",
    amount: 500,
    transaction_date: "2025-12-02",
    status: "Completed",
    reference: "BNK987654",
    notes: "ATM withdrawal.",
  },
  {
    transaction_id: "T-003",
    customer_id: "CU-003",
    account: "AC-003",
    transaction_type: "Deposit",
    amount: 2500,
    transaction_date: "2025-12-03",
    status: "Pending",
    reference: "CSH555888",
    notes: "Cash deposit at branch.",
  },
  {
    transaction_id: "T-004",
    customer_id: "CU-001",
    account: "AC-001",
    transaction_type: "Transfer",
    amount: 1200,
    transaction_date: "2025-12-04",
    status: "Completed",
    reference: "TRF112233",
    notes: "Transfer to savings account.",
  },
  {
    transaction_id: "T-005",
    customer_id: "CU-004",
    account: "AC-004",
    transaction_type: "Deposit",
    amount: 3000,
    transaction_date: "2025-12-05",
    status: "Failed",
    reference: "MP654321",
    notes: "Failed M-Pesa deposit.",
  },
];

const Transactions = () => {
  const [dialog, setDialog] = useState<null | {
    type: "view" | "edit" | "delete";
    transaction: any;
  }>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Attach action handlers to each row
    setData(
      FAKE_TRANSACTIONS.map((t) => ({
        ...t,
        onView: () => setDialog({ type: "view", transaction: t }),
        onEdit: () => setDialog({ type: "edit", transaction: t }),
        onDelete: () => setDialog({ type: "delete", transaction: t }),
      }))
    );
  }, []);

  const TransactionDialog = ({
    open,
    type,
    transaction,
    onClose,
    onSave,
  }: any) => {
    const [form, setForm] = useState<any>(
      transaction || {
        transaction_id: "",
        customer_id: "",
        account: "",
        transaction_type: "Deposit",
        amount: 0,
        transaction_date: new Date().toISOString().slice(0, 10),
        status: "Pending",
        reference: "",
        notes: "",
      }
    );
    useEffect(() => {
      if (transaction) setForm(transaction);
      else
        setForm({
          transaction_id: "",
          customer_id: "",
          account: "",
          transaction_type: "Deposit",
          amount: 0,
          transaction_date: new Date().toISOString().slice(0, 10),
          status: "Pending",
          reference: "",
          notes: "",
        });
    }, [transaction, open]);
    if (!open) return null;
    const isView = type === "view";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-md rounded bg-white dark:bg-blue-900 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {type === "edit"
              ? "Edit Transaction"
              : type === "view"
              ? "Transaction Details"
              : ""}
          </h2>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (onSave) onSave(form);
              onClose();
            }}
          >
            <div>
              <label className="block text-xs mb-1">Transaction ID</label>
              <input
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.transaction_id}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Customer ID</label>
              <input
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.customer_id}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, customer_id: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Account</label>
              <input
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.account}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, account: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Type</label>
              <select
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.transaction_type}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({
                    ...f,
                    transaction_type: e.target.value,
                  }))
                }
              >
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1">Amount</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.amount}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({
                    ...f,
                    amount: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.transaction_date}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({
                    ...f,
                    transaction_date: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Status</label>
              <select
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.status}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1">Reference</label>
              <input
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.reference}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, reference: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Notes</label>
              <textarea
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.notes}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              {!isView && (
                <Button type="submit" size="sm">
                  Save
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ConfirmDialog = ({ open, onClose, message }: any) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-xs rounded bg-white dark:bg-blue-900 p-6">
          <div className="mb-4">{message}</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onClose(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleSave = (transaction: any) => {
    setData((prev) =>
      prev.map((t) =>
        t.transaction_id === transaction.transaction_id
          ? {
              ...transaction,
              onView: t.onView,
              onEdit: t.onEdit,
              onDelete: t.onDelete,
            }
          : t
      )
    );
  };
  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((t) => t.transaction_id !== id));
  };

  return (
    <>
      <Breadcrumb
        title="Transactions"
        description="Browse and audit transaction history"
        homePath="/"
      />
      <DataTable
        title="Transactions"
        route="/transactions/edit"
        btnTitle="Create Transaction"
        data={data}
        columns={columns}
        filters="account"
        searchable
        exportable
      />
      {/* Dialogs */}
      {dialog && (dialog.type === "view" || dialog.type === "edit") && (
        <TransactionDialog
          open={true}
          type={dialog.type}
          transaction={dialog.transaction}
          onClose={() => setDialog(null)}
          onSave={
            dialog.type === "edit"
              ? (t: any) => {
                  handleSave(t);
                  setDialog(null);
                }
              : undefined
          }
        />
      )}
      {dialog && dialog.type === "delete" && (
        <ConfirmDialog
          open={true}
          message={`Are you sure you want to delete transaction ${dialog.transaction.transaction_id}?`}
          onClose={(confirmed: boolean) => {
            if (confirmed) handleDelete(dialog.transaction.transaction_id);
            setDialog(null);
          }}
        />
      )}
    </>
  );
};

export default Transactions;
