import { FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LucideIcon from "@/components/LucideIcon";
import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";

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
    {
      loanId: "L-103",
      borrower: "Alice Smith",
      daysPastDue: 15,
      bucket: "0-30",
      outstanding: 15000,
    },
    {
      loanId: "L-104",
      borrower: "Bob Brown",
      daysPastDue: 120,
      bucket: ">90",
      outstanding: 60000,
    },
    {
      loanId: "L-105",
      borrower: "Carol White",
      daysPastDue: 33,
      bucket: "30-60",
      outstanding: 21000,
    },
  ];
  const columns = [
    { header: "Loan", accessorKey: "loanId" },
    { header: "Borrower", accessorKey: "borrower" },
    {
      header: "DPD",
      accessorKey: "daysPastDue",
      cell: ({ row }: any) => (
        <span>{Number(row.original.daysPastDue).toLocaleString()}</span>
      ),
    },
    { header: "Bucket", accessorKey: "bucket" },
    {
      header: "Outstanding",
      accessorKey: "outstanding",
      cell: ({ row }: any) => (
        <span>{Number(row.original.outstanding).toLocaleString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="outline" size="icon" className="p-0 rounded-full">
              <LucideIcon name="Pen" size={17} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("View Details")}>
              <LucideIcon name="Eye" size={16} className="mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Contact Borrower")}>
              <LucideIcon name="Phone" size={16} className="mr-2" /> Contact
              Borrower
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Send Reminder")}>
              <LucideIcon name="Bell" size={16} className="mr-2" /> Send
              Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Record Payment")}>
              <LucideIcon name="DollarSign" size={16} className="mr-2" /> Record
              Payment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Reschedule Loan")}>
              <LucideIcon name="RefreshCw" size={16} className="mr-2" />{" "}
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Close Collection")}>
              <LucideIcon name="CheckCircle" size={16} className="mr-2" /> Close
              Collection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
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
      <Breadcrumb
        title="Collections"
        description="Overview of loans in collections and their metrics."
        homePath="/loans"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Accounts in collections</div>
          <div className="text-lg font-semibold">
            {metrics.count.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total outstanding</div>
          <div className="text-lg font-semibold">
            {metrics.totalOutstanding.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Avg DPD</div>
          <div className="text-lg font-semibold">
            {metrics.avgDPD.toLocaleString()} days
          </div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Max DPD</div>
          <div className="text-lg font-semibold">
            {metrics.maxDPD.toLocaleString()} days
          </div>
        </div>
        {metrics.buckets.length > 0 && (
          <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
            <div className="text-xs text-slate-500">Buckets</div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {metrics.buckets.map(([b, c]) => `${b}: ${c}`).join(" • ")}
            </div>
          </div>
        )}
      </div>
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
