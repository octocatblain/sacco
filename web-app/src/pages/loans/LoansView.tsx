import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import type { LoanScheduleItem, Repayment, Guarantor } from "@/types";
import { calcSchedule, computeArrears } from "@/lib/loanMath";
import DisburseDialog from "@/components/loans/DisburseDialog";
import RepaymentDialog from "@/components/loans/RepaymentDialog";
import RescheduleDialog from "@/components/loans/RescheduleDialog";
import TopUpDialog from "@/components/loans/TopUpDialog";
import GuarantorDialog from "@/components/loans/GuarantorDialog";

const LoansView: FC = () => {
  const { loanId } = useParams();
  const [principal, setPrincipal] = useState<number>(() =>
    Number(localStorage.getItem("loan_principal") || 100000)
  );
  const [annualRate, setAnnualRate] = useState<number>(() =>
    Number(localStorage.getItem("loan_rate") || 0.18)
  );
  const [termMonths, setTermMonths] = useState<number>(() =>
    Number(localStorage.getItem("loan_term") || 12)
  );
  const [schedule, setSchedule] = useState<LoanScheduleItem[]>(() =>
    calcSchedule({ principal, annualRate, termMonths })
  );
  const [repayments, setRepayments] = useState<Repayment[]>(() => {
    const raw = localStorage.getItem("loan_repayments");
    return raw ? JSON.parse(raw) : [];
  });
  const [guarantors, setGuarantors] = useState<Guarantor[]>(() => {
    const raw = localStorage.getItem("loan_guarantors");
    return raw
      ? JSON.parse(raw)
      : [{ id: "g1", name: "Jane Doe", liability: 20000 }];
  });

  const arrears = useMemo(
    () => computeArrears(schedule, repayments),
    [schedule, repayments]
  );

  const totals = useMemo(() => {
    const interest = schedule.reduce((acc, s) => acc + s.interest, 0);
    const fees = schedule.reduce((acc, s) => acc + s.fees, 0);
    const total = schedule.reduce((acc, s) => acc + s.totalDue, 0);
    return {
      interest: Math.round(interest * 100) / 100,
      fees: Math.round(fees * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [schedule]);

  const scheduleColumns = [
    { header: "#", accessorKey: "installmentNo" },
    { header: "Due", accessorKey: "dueDate" },
    { header: "Opening", accessorKey: "openingBalance" },
    { header: "Interest", accessorKey: "interest" },
    { header: "Principal", accessorKey: "principal" },
    { header: "Fees", accessorKey: "fees" },
    { header: "Total", accessorKey: "totalDue" },
    { header: "Closing", accessorKey: "closingBalance" },
  ];

  const repaymentsColumns = [
    { header: "Date", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Method", accessorKey: "method" },
    { header: "Notes", accessorKey: "notes" },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => editRepayment(row.original.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeRepayment(row.original.id)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const guarantorColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Liability", accessorKey: "liability" },
    { header: "Co-Guarantor", accessorKey: "coGuarantor" },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => editGuarantor(row.original.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeGuarantor(row.original.id)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const addRepayment = (amount: number, method?: string, notes?: string) => {
    setRepayments((prev) => {
      const next = [
        {
          id: `r${Date.now()}`,
          loanId: loanId || "L-1",
          amount,
          date: new Date().toISOString(),
          method,
          notes,
        },
        ...prev,
      ];
      localStorage.setItem("loan_repayments", JSON.stringify(next));
      return next;
    });
  };

  const editRepayment = (id: string) => {
    setRepayments((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, amount: r.amount + 1 } : r
      );
      localStorage.setItem("loan_repayments", JSON.stringify(next));
      return next;
    });
  };

  const removeRepayment = (id: string) => {
    setRepayments((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem("loan_repayments", JSON.stringify(next));
      return next;
    });
  };

  const disburse = (amount: number) => {
    setPrincipal(amount);
    localStorage.setItem("loan_principal", String(amount));
    setSchedule(calcSchedule({ principal: amount, annualRate, termMonths }));
  };

  const reschedule = (rate: number, term: number) => {
    setAnnualRate(rate);
    setTermMonths(term);
    localStorage.setItem("loan_rate", String(rate));
    localStorage.setItem("loan_term", String(term));
    setSchedule(
      calcSchedule({ principal, annualRate: rate, termMonths: term })
    );
  };

  const topUp = (amount: number) => {
    const nextPrincipal = principal + amount;
    setPrincipal(nextPrincipal);
    localStorage.setItem("loan_principal", String(nextPrincipal));
    setSchedule(
      calcSchedule({ principal: nextPrincipal, annualRate, termMonths })
    );
  };

  const addGuarantor = (g: Guarantor) => {
    setGuarantors((prev) => {
      const next = [g, ...prev];
      localStorage.setItem("loan_guarantors", JSON.stringify(next));
      return next;
    });
  };

  const editGuarantor = (id: string) => {
    setGuarantors((prev) => {
      const next = prev.map((g) =>
        g.id === id ? { ...g, liability: g.liability + 100 } : g
      );
      localStorage.setItem("loan_guarantors", JSON.stringify(next));
      return next;
    });
  };

  const removeGuarantor = (id: string) => {
    setGuarantors((prev) => {
      const next = prev.filter((g) => g.id !== id);
      localStorage.setItem("loan_guarantors", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Loan {loanId || "L-1"}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Principal {principal.toLocaleString()} • Rate{" "}
            {(annualRate * 100).toFixed(2)}% • Term {termMonths} months
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DisburseDialog onDisburse={disburse} />
          <TopUpDialog onTopUp={topUp} />
          <RescheduleDialog
            initialRate={annualRate}
            initialTermMonths={termMonths}
            onReschedule={reschedule}
          />
          <RepaymentDialog onRepay={addRepayment} />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border bg-white dark:bg-blue-900 p-4">
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-slate-500">Outstanding</div>
            <div className="text-lg font-semibold">
              {arrears.totalOutstanding.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Overdue installments</div>
            <div className="text-lg font-semibold">{arrears.overdueCount}</div>
          </div>
          <div>
            <div className="text-slate-500">Total Interest</div>
            <div className="text-lg font-semibold">
              {totals.interest.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Total Fees</div>
            <div className="text-lg font-semibold">
              {totals.fees.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Total Payable</div>
            <div className="text-lg font-semibold">
              {totals.total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Amortization Schedule</h2>
        <GuarantorDialog onAdd={addGuarantor} />
      </div>
      <DataTable
        columns={scheduleColumns as any}
        data={schedule}
        title={undefined as any}
        btnTitle={undefined as any}
        route={undefined as any}
        filters="dueDate"
        reportHeading="Loan Amortization Schedule"
      />

      {/* Repayments */}
      <DataTable
        columns={repaymentsColumns as any}
        data={repayments}
        title="Repayments"
        btnTitle={undefined as any}
        route={undefined as any}
        filters="date"
        reportHeading="Loan Repayments"
      />

      {/* Guarantors */}
      <DataTable
        columns={guarantorColumns as any}
        data={guarantors}
        title="Guarantors"
        btnTitle={undefined as any}
        route={undefined as any}
        filters="name"
        reportHeading="Loan Guarantors"
      />
    </div>
  );
};

export default LoansView;
