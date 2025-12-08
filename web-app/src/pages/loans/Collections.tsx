import { FC, useMemo } from "react";
import { DataTable } from "@/components/data-table";

const Collections: FC = () => {
  const data = [
    {
      loanId: "L-101",
      borrower: "John Doe",
      daysPastDue: 45,
      bucket: "30-60",
      outstanding: 32000,
    },
    {
      loanId: "L-102",
      borrower: "Mary Jane",
      daysPastDue: 75,
      bucket: "60-90",
      outstanding: 45000,
    },
  ];
  const columns = [
    { header: "Loan", accessorKey: "loanId" },
    { header: "Borrower", accessorKey: "borrower" },
    { header: "DPD", accessorKey: "daysPastDue" },
    { header: "Bucket", accessorKey: "bucket" },
    { header: "Outstanding", accessorKey: "outstanding" },
  ];
  const metrics = useMemo(() => {
    const count = data.length;
    const totalOutstanding = data.reduce((a, d) => a + (d.outstanding || 0), 0);
    const avgDPD =
      Math.round(
        (data.reduce((a, d) => a + (d.daysPastDue || 0), 0) /
          Math.max(count, 1)) *
          10
      ) / 10;
    const maxDPD = Math.max(...data.map((d) => d.daysPastDue || 0));
    const buckets = Array.from(
      data.reduce(
        (map, d) => map.set(d.bucket, (map.get(d.bucket) || 0) + 1),
        new Map<string, number>()
      )
    );
    return { count, totalOutstanding, avgDPD, maxDPD, buckets };
  }, [data]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Accounts in collections</div>
          <div className="text-lg font-semibold">{metrics.count}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total outstanding</div>
          <div className="text-lg font-semibold">
            {metrics.totalOutstanding.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Avg DPD</div>
          <div className="text-lg font-semibold">{metrics.avgDPD} days</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Max DPD</div>
          <div className="text-lg font-semibold">{metrics.maxDPD} days</div>
        </div>
      </div>
      {metrics.buckets.length > 0 && (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          Buckets: {metrics.buckets.map(([b, c]) => `${b}: ${c}`).join(" • ")}
        </div>
      )}
      <DataTable
        columns={columns as any}
        data={data}
        title="Collections / NPL"
        filters="borrower"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Collections Report"
      />
    </div>
  );
};

export default Collections;
