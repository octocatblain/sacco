import { FC, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { calcSchedule, computeArrears } from "@/lib/loanMath";
import type { Repayment } from "@/types";

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
    <div>
      <div className="mb-3 text-sm">
        Total outstanding:{" "}
        <strong>{res.totalOutstanding.toLocaleString()}</strong>
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
