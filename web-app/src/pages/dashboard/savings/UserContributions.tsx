"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import type {
  StandingOrder,
  ContributionScheduleItem,
  SavingsProduct,
} from "@/types";
// import { calcSchedule } from "@/lib/loanMath"; // removed unused import
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LucideIcon from "@/components/LucideIcon";

const mockProducts: any[] = [
  {
    id: "SP-001",
    name: "Voluntary Savings",
    type: "voluntary",
    minContribution: 500,
    maxContribution: 50000,
    interestRate: 0.05,
    standingOrderAllowed: true,
    description: "Flexible savings for any purpose.",
    createdBy: "Admin",
    createdAt: "2024-01-10",
  },
  {
    id: "SP-002",
    name: "Holiday Savings",
    type: "voluntary",
    minContribution: 1000,
    maxContribution: 20000,
    interestRate: 0.04,
    standingOrderAllowed: false,
    description: "Save for holidays and special events.",
    createdBy: "Admin",
    createdAt: "2024-02-15",
  },
];

const UserContributions: FC = () => {
  const [selectedProduct] = useState<SavingsProduct>(mockProducts[0]);
  const [standingOrders] = useState<StandingOrder[]>([
    {
      id: "SO-1",
      accountId: "AC-1",
      productId: selectedProduct.id,
      amount: 2000,
      frequency: "monthly",
      startDate: new Date().toISOString(),
      active: true,
    },
  ]);
  const [contributions, setContributions] = useState<any[]>([
    {
      id: "C-1",
      accountId: "AC-1",
      productId: mockProducts[0].id,
      date: new Date().toISOString(),
      amount: 2000,
      method: "M-Pesa",
      reference: "MP123456",
      status: "Completed",
      notes: "Salary savings for December.",
    },
    {
      id: "C-2",
      accountId: "AC-1",
      productId: mockProducts[1].id,
      date: new Date(Date.now() - 86400000 * 10).toISOString(),
      amount: 1500,
      method: "Bank",
      reference: "BNK987654",
      status: "Completed",
      notes: "Holiday savings top-up.",
    },
    {
      id: "C-3",
      accountId: "AC-1",
      productId: mockProducts[0].id,
      date: new Date(Date.now() - 86400000 * 30).toISOString(),
      amount: 5000,
      method: "Cash",
      reference: "CSH555888",
      status: "Pending",
      notes: "Cash deposit at branch.",
    },
    {
      id: "C-4",
      accountId: "AC-1",
      productId: mockProducts[1].id,
      date: new Date(Date.now() - 86400000 * 45).toISOString(),
      amount: 2500,
      method: "M-Pesa",
      reference: "MP654321",
      status: "Completed",
      notes: "Early holiday savings.",
    },
  ]);

  const schedule: ContributionScheduleItem[] = useMemo(() => {
    // minimal schedule mock: next 6 dates, due equals standing order amount
    const baseAmount =
      standingOrders[0]?.amount || selectedProduct.minContribution || 0;
    const items: ContributionScheduleItem[] = [];
    const now = new Date();
    for (let i = 1; i <= 6; i++) {
      const d = new Date(now);
      d.setMonth(d.getMonth() + i);
      const iso = d.toISOString();
      const paid = contributions
        .filter((c) => c.date.slice(0, 10) === iso.slice(0, 10))
        .reduce((a, c) => a + c.amount, 0);
      const outstanding = Math.max(baseAmount - paid, 0);
      items.push({
        id: `S-${i}`,
        date: iso,
        dueAmount: baseAmount,
        paidAmount: paid,
        outstanding,
        overdue: outstanding > 0 && d < new Date(),
      });
    }
    return items;
  }, [standingOrders, selectedProduct, contributions]);

  const [dialog, setDialog] = useState(
    null as
      | null
      | { type: "add" }
      | { type: "edit"; contribution: any }
      | { type: "view"; contribution: any }
      | { type: "delete"; contribution: any }
  );

  const contributionCols = [
    { header: "Date", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Method", accessorKey: "method" },
    { header: "Reference", accessorKey: "reference" },
    { header: "Status", accessorKey: "status" },
    { header: "Notes", accessorKey: "notes" },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="rounded-full">
              <LucideIcon name="Pen" className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                setDialog({ type: "view", contribution: row.original })
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setDialog({ type: "edit", contribution: row.original })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setDialog({ type: "delete", contribution: row.original })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  const scheduleCols = [
    { header: "Date", accessorKey: "date" },
    { header: "Due", accessorKey: "dueAmount" },
    { header: "Paid", accessorKey: "paidAmount" },
    { header: "Outstanding", accessorKey: "outstanding" },
    { header: "Overdue", accessorKey: "overdue" },
  ];

  const metrics = useMemo(() => {
    const totalContrib = contributions.reduce((a, c) => a + c.amount, 0);
    const outstanding = schedule.reduce((a, s) => a + s.outstanding, 0);
    return { totalContrib, outstanding };
  }, [contributions, schedule]);

  const handleAdd = () => setDialog({ type: "add" });
  const handleSave = (contribution: any) => {
    setContributions((prev) => {
      if (dialog && dialog.type === "edit" && dialog.contribution) {
        // Edit
        return prev.map((c) =>
          c.id === dialog.contribution!.id ? { ...contribution, id: c.id } : c
        );
      } else {
        // Add
        return [{ ...contribution, id: `C-${Date.now()}` }, ...prev];
      }
    });
  };
  const handleDelete = (id: string) => {
    setContributions((prev) => prev.filter((c) => c.id !== id));
  };

  // Dialog components
  const ContributionDialog = ({
    open,
    type,
    contribution,
    onClose,
    onSave,
  }: any) => {
    const [form, setForm] = useState<any>(
      contribution || {
        id: "",
        accountId: "AC-1",
        productId: selectedProduct.id,
        date: new Date().toISOString(),
        amount: 0,
        method: "M-Pesa",
        reference: "",
        status: "Pending",
        notes: "",
      }
    );
    useEffect(() => {
      if (contribution) setForm(contribution);
      else
        setForm({
          id: "",
          accountId: "AC-1",
          productId: selectedProduct.id,
          date: new Date().toISOString(),
          amount: 0,
          method: "M-Pesa",
          reference: "",
          status: "Pending",
          notes: "",
        });
    }, [contribution, open]);
    if (!open) return null;
    const isView = type === "view";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="w-full max-w-md rounded bg-white dark:bg-blue-900 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {type === "add"
              ? "Add Contribution"
              : type === "edit"
              ? "Edit Contribution"
              : "Contribution Details"}
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
              <label className="block text-xs mb-1">Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.date.slice(0, 10)}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, date: e.target.value }))
                }
              />
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
              <label className="block text-xs mb-1">Method</label>
              <select
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.method}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({ ...f, method: e.target.value }))
                }
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
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

  return (
    <div className="space-y-3">
      <Breadcrumb
        title="My Savings Contributions"
        description="Manage your savings products catalog"
        homePath="/dashboard"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">My Savings Contributions</h1>
        <Button size="sm" onClick={handleAdd}>
          Add Contribution
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total contributed</div>
          <div className="text-lg font-semibold">
            {metrics.totalContrib.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total outstanding</div>
          <div className="text-lg font-semibold">
            {metrics.outstanding.toLocaleString()}
          </div>
        </div>
      </div>
      <DataTable
        columns={contributionCols as any}
        data={contributions}
        title="Contributions"
        filters="date"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Savings Contributions"
      />
      <DataTable
        columns={scheduleCols as any}
        data={schedule}
        title="Contribution Schedule"
        filters="date"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Contribution Schedule"
      />
      {/* Dialogs */}
      {dialog &&
        (dialog.type === "add" ||
          dialog.type === "edit" ||
          dialog.type === "view") && (
          <ContributionDialog
            open={true}
            type={dialog.type}
            contribution={
              dialog.type !== "add" ? dialog.contribution : undefined
            }
            onClose={() => setDialog(null)}
            onSave={
              dialog.type !== "view"
                ? (c: any) => {
                    handleSave(c);
                    setDialog(null);
                  }
                : undefined
            }
          />
        )}
      {dialog && dialog.type === "delete" && (
        <ConfirmDialog
          open={true}
          message={`Are you sure you want to delete this contribution of KES ${dialog.contribution.amount}?`}
          onClose={(confirmed: boolean) => {
            if (confirmed) handleDelete(dialog.contribution.id);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default UserContributions;
