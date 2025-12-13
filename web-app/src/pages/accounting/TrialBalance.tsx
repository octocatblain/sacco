import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import type { TrialBalanceRow } from "@/types";

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
];

export default function TrialBalance() {
  const [rows] = useState<TrialBalanceRow[]>(() => FAKE_TRIAL_BALANCE);
  // No localStorage or API, just fakedata

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
