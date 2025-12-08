import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { Account, AccountType } from "@/types";

const load = (): Account[] => {
  try {
    return JSON.parse(localStorage.getItem("acc_accounts") || "[]");
  } catch {
    return [];
  }
};

const save = (rows: Account[]) =>
  localStorage.setItem("acc_accounts", JSON.stringify(rows));

export default function ChartOfAccounts() {
  const [rows, setRows] = useState<Account[]>(() => load());
  const [form, setForm] = useState<Partial<Account>>({
    type: "ASSET",
    is_active: true,
    currency: "KES",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    save(rows);
  }, [rows]);

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
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => remove(row.original.id)}
            >
              Delete
            </Button>
          </div>
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
  };

  const remove = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Chart of Accounts</h1>
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

      <section className="rounded-lg border bg-white dark:bg-blue-900 p-4 space-y-3">
        <h2 className="font-semibold">
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
        <div className="flex gap-2">
          <Button onClick={add}>{editingId ? "Update" : "Add"}</Button>
          {editingId ? (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </section>

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
