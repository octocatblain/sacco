import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import type { TrialBalanceRow } from "@/types";
import { useMemo, useState } from "react";
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
import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";

// Fake data for trial balance rows
const FAKE_TRIAL_BALANCE: TrialBalanceRow[] = [
  {
    account__id: 1,
    account__code: "1001",
    account__name: "Cash",
    account__type: "ASSET",
    debit: 10000,
    credit: 0,
    balance: 10000,
  },
  {
    account__id: 2,
    account__code: "2001",
    account__name: "Accounts Payable",
    account__type: "LIABILITY",
    debit: 0,
    credit: 10000,
    balance: -10000,
  },
  {
    account__id: 3,
    account__code: "3001",
    account__name: "Equity",
    account__type: "EQUITY",
    debit: 0,
    credit: 5000,
    balance: -5000,
  },
  {
    account__id: 4,
    account__code: "4001",
    account__name: "Revenue",
    account__type: "INCOME",
    debit: 0,
    credit: 20000,
    balance: -20000,
  },
  {
    account__id: 5,
    account__code: "5001",
    account__name: "Office Supplies",
    account__type: "EXPENSE",
    debit: 3000,
    credit: 0,
    balance: 3000,
  },
];

export default function TrialBalance() {
  const [rows, setRows] = useState<TrialBalanceRow[]>(() => FAKE_TRIAL_BALANCE);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    row: null as TrialBalanceRow | null,
  });

  const handleConfirm = (action: string, row: TrialBalanceRow) => {
    setConfirmDialog({ open: true, action, row });
  };
  const closeConfirm = () =>
    setConfirmDialog({ open: false, action: "", row: null });

  // For demo, only allow delete (removes row)
  const remove = (id: number) =>
    setRows((prev) => prev.filter((r) => r.account__id !== id));

  const columns = useMemo(
    () => [
      {
        header: "Account",
        id: "account",
        accessorFn: (r: TrialBalanceRow) =>
          `${r.account__code} ${r.account__name}`,
      },
      {
        header: "Debit",
        accessorKey: "debit",
        cell: ({ row }: any) => row.original.debit.toLocaleString(),
      },
      {
        header: "Credit",
        accessorKey: "credit",
        cell: ({ row }: any) => row.original.credit.toLocaleString(),
      },
      {
        header: "Balance",
        accessorKey: "balance",
        cell: ({ row }: any) => row.original.balance.toLocaleString(),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full p-0"
              >
                <LucideIcon name="Pen" className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleConfirm("View", row.original)}
              >
                <LucideIcon name="Eye" size={16} className="mr-2" /> View
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
    ],
    []
  ) as any;

  const totals = useMemo(
    () => ({
      debit: rows.reduce((s, r) => s + r.debit, 0),
      credit: rows.reduce((s, r) => s + r.credit, 0),
    }),
    [rows]
  );

  return (
    <div className="space-y-4">
      <Breadcrumb
        title="Trial Balance"
        description="Debits and credits summary"
        homePath="/"
      />
      <div className="flex items-center justify-between"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Debit</div>
          <div className="text-lg font-semibold">
            {totals.debit.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Credit</div>
          <div className="text-lg font-semibold">
            {totals.credit.toLocaleString()}
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        title="Trial Balance"
        filters="account__code"
        reportHeading="Trial Balance"
      />
      {/* Dialogs */}
      <Dialog open={confirmDialog.open} onOpenChange={closeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "Delete"
                ? "Confirm Delete"
                : "Account Details"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "Delete"
                ? `Are you sure you want to delete account ${confirmDialog.row?.account__code} - ${confirmDialog.row?.account__name}?`
                : confirmDialog.row && (
                    <div className="space-y-2 mt-2">
                      <div>
                        <b>Account:</b> {confirmDialog.row.account__code}{" "}
                        {confirmDialog.row.account__name}
                      </div>
                      <div>
                        <b>Type:</b> {confirmDialog.row.account__type}
                      </div>
                      <div>
                        <b>Debit:</b> {confirmDialog.row.debit.toLocaleString()}
                      </div>
                      <div>
                        <b>Credit:</b>{" "}
                        {confirmDialog.row.credit.toLocaleString()}
                      </div>
                      <div>
                        <b>Balance:</b>{" "}
                        {confirmDialog.row.balance.toLocaleString()}
                      </div>
                    </div>
                  )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {confirmDialog.action === "Delete" ? (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    if (confirmDialog.row)
                      remove(confirmDialog.row.account__id);
                    closeConfirm();
                  }}
                >
                  Yes
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </>
            ) : (
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
