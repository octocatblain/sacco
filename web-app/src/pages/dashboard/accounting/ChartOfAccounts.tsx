"use client";

import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
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
import type { Account, AccountType } from "@/types";
import { useMemo, useState } from "react";

// Fake data for accounts
const FAKE_ACCOUNTS: Account[] = [
  {
    id: 1,
    code: "1001",
    name: "Cash",
    type: "ASSET",
    currency: "KES",
    is_active: true,
  },
  {
    id: 2,
    code: "2001",
    name: "Accounts Payable",
    type: "LIABILITY",
    currency: "KES",
    is_active: true,
  },
  {
    id: 3,
    code: "3001",
    name: "Equity",
    type: "EQUITY",
    currency: "KES",
    is_active: true,
  },
];

export default function ChartOfAccounts() {
  const [rows, setRows] = useState<Account[]>(() => FAKE_ACCOUNTS);
  const [form, setForm] = useState<Partial<Account>>({
    type: "ASSET",
    is_active: true,
    currency: "KES",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // No localStorage or API, just fakedata

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    account: null as Account | null,
  });

  const handleConfirm = (action: string, account: Account) => {
    setConfirmDialog({ open: true, action, account });
  };
  const closeConfirm = () =>
    setConfirmDialog({ open: false, action: "", account: null });

  const columns = useMemo(
    () => [
      { header: "Code", accessorKey: "code" },
      { header: "Name", accessorKey: "name" },
      { header: "Type", accessorKey: "type" },
      { header: "Currency", accessorKey: "currency" },
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
              <DropdownMenuItem onClick={() => startEdit(row.original)}>
                <LucideIcon name="Pen" size={16} className="mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfirm("Delete", row.original)}
              >
                <LucideIcon name="Trash2" size={16} className="mr-2" /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleConfirm("Deactivate", row.original)}
              >
                <LucideIcon name="UserX" size={16} className="mr-2" />{" "}
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [rows]
  ) as any;

  const analytics = useMemo(() => {
    const total = rows.length;
    const byType: Record<AccountType, number> = {
      ASSET: 0,
      LIABILITY: 0,
      EQUITY: 0,
      INCOME: 0,
      EXPENSE: 0,
    } as any;
    rows.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
    });
    return { total, byType };
  }, [rows]);

  const resetForm = () => {
    setForm({ type: "ASSET", is_active: true, currency: "KES" });
    setEditingId(null);
  };

  const add = () => {
    if (!form.code || !form.name || !form.type) return;
    const exists = rows.some((r) => r.code === form.code);
    if (exists && editingId === null) return alert("Code already exists");
    if (editingId !== null) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...(r as Account), ...(form as Account), id: editingId }
            : r
        )
      );
    } else {
      const id = Date.now();
      setRows((prev) => [
        {
          id,
          code: form.code!,
          name: form.name!,
          type: form.type as AccountType,
          parent: null,
          is_active: !!form.is_active,
          currency: form.currency || "KES",
        },
        ...prev,
      ]);
    }
    resetForm();
    setOpen(false);
  };

  const startEdit = (acc: Account) => {
    setEditingId(acc.id);
    setForm({
      code: acc.code,
      name: acc.name,
      type: acc.type,
      currency: acc.currency,
      is_active: acc.is_active,
      parent: acc.parent ?? null,
    });
    setOpen(true);
  };

  const remove = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));
  const deactivate = (id: number) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_active: false } : r))
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb
          title="Chart of Accounts"
          description="List and structure of accounts"
          homePath="/"
        />
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Accounts</div>
          <div className="text-lg font-semibold">{analytics.total}</div>
        </div>
        {(
          ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"] as AccountType[]
        ).map((t) => (
          <div
            key={t}
            className="rounded-lg border bg-white dark:bg-blue-900 p-3"
          >
            <div className="text-xs text-slate-500">{t}</div>
            <div className="text-lg font-semibold">
              {analytics.byType[t] || 0}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-md bg-white p-4 dark:bg-blue-900">
            <h2 className="font-semibold mb-3">
              {editingId ? "Edit Account" : "Add Account"}
            </h2>
            <div className="grid md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm">Code</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.code || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Name</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm">Type</label>
                <select
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.type as string}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as AccountType,
                    }))
                  }
                >
                  <option value="ASSET">Asset</option>
                  <option value="LIABILITY">Liability</option>
                  <option value="EQUITY">Equity</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Currency</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.currency || "KES"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, currency: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={add}>{editingId ? "Update" : "Add"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={closeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to <b>{confirmDialog.action}</b>
              {confirmDialog.account
                ? ` account ${confirmDialog.account.code} - ${confirmDialog.account.name}?`
                : "?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                if (confirmDialog.action === "Delete")
                  remove(confirmDialog.account!.id);
                if (confirmDialog.action === "Deactivate")
                  deactivate(confirmDialog.account!.id);
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

      <DataTable
        columns={columns}
        data={rows}
        title="Accounts"
        filters="name"
        reportHeading="Chart of Accounts"
      />
    </div>
  );
}
