import { FC, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { calcSchedule, computeArrears } from "@/lib/loanMath";
import type { Repayment } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const Arrears: FC = () => {
  const schedule = useMemo(
    () => calcSchedule({ principal: 80000, annualRate: 0.18, termMonths: 12 }),
    []
  );
  const [repayments] = useState<Repayment[]>([
    { id: "r1", loanId: "L-1", amount: 10000, date: new Date().toISOString() },
  ]);
  const res = computeArrears(schedule, repayments);
  const columns = [
    { header: "#", accessorKey: "installmentNo" },
    { header: "Due", accessorKey: "dueDate" },
    { header: "Total Due", accessorKey: "totalDue" },
    { header: "Paid", accessorKey: "paidAmount" },
    { header: "Outstanding", accessorKey: "outstanding" },
    { header: "Overdue", accessorKey: "overdue" },
  ];
  return (
    <div className="space-y-3">
      <Breadcrumb
        title="Loan Arrears"
        description="View and manage loan arrears"
        homePath="/loans/arrears"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total outstanding</div>
          <div className="text-lg font-semibold">
            {res.totalOutstanding.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Overdue installments</div>
          <div className="text-lg font-semibold">{res.overdueCount}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Paid so far</div>
          <div className="text-lg font-semibold">
            {res.items
              .reduce((a, i) => a + (i.paidAmount || 0), 0)
              .toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Installments</div>
          <div className="text-lg font-semibold">{res.items.length}</div>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={res.items}
        title="Arrears"
        filters="dueDate"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Loan Arrears"
      />
    </div>
  );
};

export default Arrears;
