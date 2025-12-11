import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import type { TrialBalanceRow } from "@/types";

export default function TrialBalance() {
  const [rows, setRows] = useState<TrialBalanceRow[]>([]);
  const [start] = useState<string>("");
  const [end] = useState<string>("");

  useEffect(() => {
    // local computation from stored journals
    try {
      const journals = JSON.parse(
        localStorage.getItem("acc_journals") || "[]"
      ) as any[];
      const map: Record<string, TrialBalanceRow> = {} as any;
      journals
        .filter((j) => j.posted)
        .forEach((j) => {
          j.lines.forEach((l: any) => {
            const key = String(l.account);
            if (!map[key])
              map[key] = {
                account__id: l.account,
                account__code: String(l.account),
                account__name: String(l.account),
                account__type: "ASSET",
                debit: 0,
                credit: 0,
                balance: 0,
              } as any;
            map[key].debit += Number(l.debit || 0);
            map[key].credit += Number(l.credit || 0);
          });
        });
      const list = Object.values(map).map((r) => ({
        ...r,
        balance: r.debit - r.credit,
      }));
      setRows(list);
    } catch {}
  }, [start, end]);

  const columns = useMemo(
    () => [
      {
        header: "Account",
        id: "account",
        accessorFn: (r: TrialBalanceRow) =>
          `${r.account__code} ${r.account__name}`,
      },
      { header: "Debit", accessorKey: "debit" },
      { header: "Credit", accessorKey: "credit" },
      { header: "Balance", accessorKey: "balance" },
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
          <div className="text-lg font-semibold">{totals.debit.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Credit</div>
          <div className="text-lg font-semibold">
            {totals.credit.toFixed(2)}
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
    </div>
  );
}
