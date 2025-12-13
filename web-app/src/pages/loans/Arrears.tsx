import { FC, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LucideIcon from "@/components/LucideIcon";
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
    {
      id: "r2",
      loanId: "L-1",
      amount: 8000,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "r3",
      loanId: "L-2",
      amount: 12000,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "r4",
      loanId: "L-3",
      amount: 5000,
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ]);
  const res = computeArrears(schedule, repayments);
  const columns = [
    { header: "#", accessorKey: "installmentNo" },
    { header: "Due", accessorKey: "dueDate" },
    {
      header: "Total Due",
      accessorKey: "totalDue",
      cell: ({ row }: any) => (
        <span>{Number(row.original.totalDue).toLocaleString()}</span>
      ),
    },
    {
      header: "Paid",
      accessorKey: "paidAmount",
      cell: ({ row }: any) => (
        <span>{Number(row.original.paidAmount).toLocaleString()}</span>
      ),
    },
    {
      header: "Outstanding",
      accessorKey: "outstanding",
      cell: ({ row }: any) => (
        <span>{Number(row.original.outstanding).toLocaleString()}</span>
      ),
    },
    {
      header: "Overdue",
      accessorKey: "overdue",
      cell: ({ row }: any) => (
        <span>{Number(row.original.overdue).toLocaleString()}</span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="ghost" size="icon" className="p-0">
              <LucideIcon name="MoreVertical" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert("View Installment Details")}>
              <LucideIcon name="Eye" size={16} className="mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Record Payment")}>
              <LucideIcon name="DollarSign" size={16} className="mr-2" /> Record
              Payment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Send Reminder")}>
              <LucideIcon name="Bell" size={16} className="mr-2" /> Send
              Reminder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Reschedule Installment")}>
              <LucideIcon name="RefreshCw" size={16} className="mr-2" />{" "}
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Mark as Paid")}>
              <LucideIcon name="CheckCircle" size={16} className="mr-2" /> Mark
              as Paid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
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
          <div className="text-lg font-semibold">
            {res.overdueCount.toLocaleString()}
          </div>
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
          <div className="text-lg font-semibold">
            {res.items.length.toLocaleString()}
          </div>
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
