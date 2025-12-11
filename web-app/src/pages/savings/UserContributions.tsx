import { FC, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import type {
  Contribution,
  StandingOrder,
  ContributionScheduleItem,
  SavingsProduct,
} from "@/types";
// import { calcSchedule } from "@/lib/loanMath"; // removed unused import
import { Button } from "@/components/ui/button";

const mockProducts: SavingsProduct[] = [
  {
    id: "SP-001",
    name: "Voluntary Savings",
    type: "voluntary",
    minContribution: 500,
    maxContribution: 50000,
    interestRate: 0.05,
    standingOrderAllowed: true,
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
  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: "C-1",
      accountId: "AC-1",
      productId: selectedProduct.id,
      date: new Date().toISOString(),
      amount: 2000,
      method: "M-Pesa",
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

  const contributionCols = [
    { header: "Date", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Method", accessorKey: "method" },
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

  const addContribution = () => {
    const id = `C-${Date.now()}`;
    setContributions((prev) => [
      {
        id,
        accountId: "AC-1",
        productId: selectedProduct.id,
        date: new Date().toISOString(),
        amount: 2000,
        method: "M-Pesa",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">My Savings Contributions</h1>
        <Button size="sm" onClick={addContribution}>
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
    </div>
  );
};

export default UserContributions;
