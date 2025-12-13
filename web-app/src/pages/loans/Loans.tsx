"use client";

import { ColumnDef } from "@tanstack/react-table";

import { useState, useCallback } from "react";
// componnts
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
// types
import { LoanProps as BaseLoanProps } from "@/types";

// Extend LoanProps to include handler functions
type LoanProps = BaseLoanProps & {
  onView?: (loan: BaseLoanProps) => void;
  onEdit?: (loan: BaseLoanProps) => void;
};
import Breadcrumb from "@/components/Breadcrumb";

// Dialog state for each action
import DisburseDialog from "@/components/loans/DisburseDialog";
import RepaymentDialog from "@/components/loans/RepaymentDialog";
import RescheduleDialog from "@/components/loans/RescheduleDialog";
import TopUpDialog from "@/components/loans/TopUpDialog";
import GuarantorDialog from "@/components/loans/GuarantorDialog";

const columns = (
  setDialogLoan: (v: LoanProps | null) => void,
  setOpenDialog: (v: null | string) => void,
  setConfirmDialog: (v: null | string) => void
): ColumnDef<LoanProps>[] => [
  {
    header: "Customer ID",
    cell: ({ row }) => (
      <div>
        <Button
          variant="link"
          onClick={() => row.original.onView?.(row.original)}
        >
          {row.original.account}
        </Button>
      </div>
    ),
  },
  {
    header: "Loan Type",
    accessorKey: "loan_type",
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span>{Number(row.original.amount).toLocaleString()}</span>
    ),
  },
  {
    header: "Balance",
    accessorKey: "loan_balance",
    cell: ({ row }) => (
      <span>{Number(row.original.loan_balance).toLocaleString()}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "loan_status",
  },
  {
    header: "Actions",
    cell: ({ row }: any) => {
      const loan = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="outline" size="icon" className="p-0 rounded-full">
              <LucideIcon name="Pen" size={17} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => loan.onView?.(loan)}>
              <LucideIcon name="Eye" size={16} className="mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => loan.onEdit?.(loan)}>
              <LucideIcon name="Pen" size={16} className="mr-2" /> Edit Loan
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setOpenDialog("disburse");
              }}
            >
              <LucideIcon name="Send" size={16} className="mr-2" /> Disburse
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setOpenDialog("repayment");
              }}
            >
              <LucideIcon name="DollarSign" size={16} className="mr-2" /> Record
              Repayment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setOpenDialog("reschedule");
              }}
            >
              <LucideIcon name="RefreshCw" size={16} className="mr-2" />{" "}
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setOpenDialog("topup");
              }}
            >
              <LucideIcon name="ArrowUpCircle" size={16} className="mr-2" /> Top
              Up
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setOpenDialog("guarantor");
              }}
            >
              <LucideIcon name="UserPlus" size={16} className="mr-2" /> Assign
              Guarantor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setConfirmDialog("repaymentSchedule");
              }}
            >
              <LucideIcon name="Calendar" size={16} className="mr-2" />{" "}
              Repayment Schedule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogLoan(loan);
                setConfirmDialog("closeLoan");
              }}
            >
              <LucideIcon name="CheckCircle" size={16} className="mr-2" /> Close
              Loan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Fake data for loans
const FAKE_LOANS: any[] = [
  {
    loan_id: "L-001",
    account: "AC-001",
    loan_type: "Personal",
    amount: 10000,
    loan_balance: 8000,
    loan_status: "Active",
  },
  {
    loan_id: "L-002",
    account: "AC-002",
    loan_type: "Business",
    amount: 20000,
    loan_balance: 15000,
    loan_status: "Pending",
  },
  {
    loan_id: "L-003",
    account: "AC-003",
    loan_type: "Auto",
    amount: 30000,
    loan_balance: 25000,
    loan_status: "Closed",
  },
  {
    loan_id: "L-004",
    account: "AC-004",
    loan_type: "Education",
    amount: 15000,
    loan_balance: 12000,
    loan_status: "Active",
  },
  {
    loan_id: "L-005",
    account: "AC-005",
    loan_type: "Mortgage",
    amount: 50000,
    loan_balance: 48000,
    loan_status: "Defaulted",
  },
  {
    loan_id: "L-006",
    account: "AC-006",
    loan_type: "Personal",
    amount: 12000,
    loan_balance: 9000,
    loan_status: "Active",
  },
  {
    loan_id: "L-007",
    account: "AC-007",
    loan_type: "Business",
    amount: 25000,
    loan_balance: 20000,
    loan_status: "Pending",
  },
  {
    loan_id: "L-008",
    account: "AC-008",
    loan_type: "Auto",
    amount: 18000,
    loan_balance: 15000,
    loan_status: "Closed",
  },
  {
    loan_id: "L-009",
    account: "AC-009",
    loan_type: "Education",
    amount: 22000,
    loan_balance: 18000,
    loan_status: "Active",
  },
  {
    loan_id: "L-010",
    account: "AC-010",
    loan_type: "Mortgage",
    amount: 60000,
    loan_balance: 59000,
    loan_status: "Defaulted",
  },
];

const Loans = () => {
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    loan: LoanProps | null;
  }>({ open: false, loan: null });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    loan: LoanProps | null;
  }>({ open: false, loan: null });
  const [data, setData] = useState<LoanProps[]>(FAKE_LOANS);
  const [openDialog, setOpenDialog] = useState<null | string>(null);
  const [dialogLoan, setDialogLoan] = useState<LoanProps | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<null | string>(null);

  // Handlers for modals
  const handleView = useCallback((loan: LoanProps) => {
    setViewModal({ open: true, loan });
  }, []);
  const handleEdit = useCallback((loan: LoanProps) => {
    setEditModal({ open: true, loan });
  }, []);
  const closeView = () => setViewModal({ open: false, loan: null });
  const closeEdit = () => setEditModal({ open: false, loan: null });

  // Attach handlers to each row
  const loansArray: LoanProps[] = data.map((loan) => ({
    ...loan,
    onView: handleView,
    onEdit: handleEdit,
  }));
  const cols = columns(setDialogLoan, setOpenDialog, setConfirmDialog);
  const totals = {
    count: loansArray.length,
    totalAmount: loansArray.reduce(
      (a, d: any) => a + (Number(d?.amount) || 0),
      0
    ),
    totalBalance: loansArray.reduce(
      (a, d: any) => a + (Number(d?.loan_balance) || 0),
      0
    ),
  };

  return (
    <div className="space-y-3">
      <Breadcrumb
        title="Loans"
        description="Manage loan applications and statuses"
        homePath="/loans"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total loans</div>
          <div className="text-lg font-semibold">{totals.count}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total amount</div>
          <div className="text-lg font-semibold">
            {totals.totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total balance</div>
          <div className="text-lg font-semibold">
            {totals.totalBalance.toLocaleString()}
          </div>
        </div>
      </div>

      <DataTable
        title="Loans"
        btnTitle="Apply Loan"
        route="/loans/edit"
        columns={cols}
        data={loansArray}
        filters="loan_type"
      />

      {/* Confirmation Dialogs */}
      {confirmDialog === "repaymentSchedule" && dialogLoan && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setConfirmDialog(null);
            setDialogLoan(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Repayment Schedule</DialogTitle>
              <DialogDescription>
                Are you sure you want to view the repayment schedule for loan{" "}
                {dialogLoan.loan_id}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setConfirmDialog(null);
                  setDialogLoan(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setConfirmDialog(null);
                  setDialogLoan(null); /* Add real handler here */
                }}
              >
                View
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {confirmDialog === "closeLoan" && dialogLoan && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setConfirmDialog(null);
            setDialogLoan(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close Loan</DialogTitle>
              <DialogDescription>
                Are you sure you want to close loan {dialogLoan.loan_id}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setConfirmDialog(null);
                  setDialogLoan(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmDialog(null);
                  setDialogLoan(null); /* Add real handler here */
                }}
              >
                Close Loan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* View Modal */}
      <Dialog open={viewModal.open} onOpenChange={closeView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>
              View details for loan {viewModal.loan?.loan_id}
            </DialogDescription>
          </DialogHeader>
          {viewModal.loan && (
            <div className="space-y-2">
              <div>
                <b>Account:</b> {viewModal.loan.account}
              </div>
              <div>
                <b>Type:</b> {viewModal.loan.loan_type}
              </div>
              <div>
                <b>Amount:</b> {viewModal.loan.amount.toLocaleString()}
              </div>
              <div>
                <b>Balance:</b> {viewModal.loan.loan_balance.toLocaleString()}
              </div>
              <div>
                <b>Status:</b> {viewModal.loan.loan_status}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModal.open} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Loan</DialogTitle>
            <DialogDescription>
              Edit details for loan {editModal.loan?.loan_id}
            </DialogDescription>
          </DialogHeader>
          {editModal.loan && (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                closeEdit();
              }}
            >
              <div>
                <label className="block text-xs">Account</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.loan.account}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Type</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.loan.loan_type}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Amount</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.loan.amount}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Balance</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.loan.loan_balance}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Status</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={editModal.loan.loan_status}
                  readOnly
                />
              </div>
              <DialogFooter>
                <Button type="submit" variant="default">
                  Save
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loans;
