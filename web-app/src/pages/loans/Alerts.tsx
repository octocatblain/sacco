import { FC, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";

const Alerts: FC = () => {
  const data = [
    {
      type: "upcoming_due",
      message: "Installment due tomorrow",
      loanId: "L-1",
      createdAt: new Date().toISOString(),
    },
    {
      type: "overdue",
      message: "Installment overdue",
      loanId: "L-2",
      createdAt: new Date().toISOString(),
    },
    {
      type: "overdue",
      message: "Second installment overdue",
      loanId: "L-3",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      type: "upcoming_due",
      message: "Final payment due next week",
      loanId: "L-4",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      type: "missed_payment",
      message: "Payment missed for 2 months",
      loanId: "L-5",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ];
  const columns = [
    { header: "Type", accessorKey: "type" },
    { header: "Message", accessorKey: "message" },
    { header: "Loan", accessorKey: "loanId" },
    { header: "Created", accessorKey: "createdAt" },
  ];
  const metrics = useMemo(() => {
    const count = data.length;
    const byType = data.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { count, byType };
  }, [data]);

  return (
    <div className="space-y-3">
      <Breadcrumb
        title="Alerts"
        description="Overview of loan alerts and their metrics."
        homePath="/loans"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total alerts</div>
          <div className="text-lg font-semibold">{metrics.count}</div>
        </div>
        {Object.entries(metrics.byType).map(([type, count]) => (
          <div
            key={type}
            className="rounded-lg border bg-white dark:bg-blue-900 p-3"
          >
            <div className="text-xs text-slate-500">
              {type.replace(/_/g, " ")}
            </div>
            <div className="text-lg font-semibold">{count}</div>
          </div>
        ))}
      </div>
      <DataTable
        columns={columns as any}
        data={data}
        title="Loan Alerts"
        filters="type"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Loan Alerts"
      />
    </div>
  );
};

export default Alerts;
