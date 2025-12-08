import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import type { LoanScheduleItem, Repayment, Guarantor } from "@/types";
import { calcSchedule, computeArrears } from "@/lib/loanMath";
import DisburseDialog from "@/components/loans/DisburseDialog";
import RepaymentDialog from "@/components/loans/RepaymentDialog";
import EditRepaymentDialog from "@/components/loans/EditRepaymentDialog";
import RescheduleDialog from "@/components/loans/RescheduleDialog";
import TopUpDialog from "@/components/loans/TopUpDialog";
import GuarantorDialog from "@/components/loans/GuarantorDialog";
import EditGuarantorDialog from "@/components/loans/EditGuarantorDialog";

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
            onClick={() => openEditRepayment(row.original.id)}
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
            onClick={() => openEditGuarantor(row.original.id)}
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

  // removed legacy editRepayment handler to avoid unused warnings

  const saveRepayment = (updated: Repayment) => {
    setRepayments((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
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

  const [editRepaymentId, setEditRepaymentId] = useState<string | null>(null);
  const [repaymentDraft, setRepaymentDraft] = useState<{
    amount: number;
    method?: string;
    notes?: string;
  } | null>(null);
  const openEditRepayment = (id: string) => {
    const r = repayments.find((x) => x.id === id);
    if (!r) return;
    setEditRepaymentId(id);
    setRepaymentDraft({ amount: r.amount, method: r.method, notes: r.notes });
  };
  const saveEditRepayment = (updates: {
    amount: number;
    method?: string;
    notes?: string;
  }) => {
    if (!editRepaymentId) return;
    const prev = repayments.find((r) => r.id === editRepaymentId);
    const updated: Repayment = {
      id: editRepaymentId,
      loanId: loanId || "L-1",
      date: prev?.date || new Date().toISOString(),
      amount: updates.amount,
      method: updates.method,
      notes: updates.notes,
    };
    saveRepayment(updated);
    setEditRepaymentId(null);
    setRepaymentDraft(null);
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

  // removed legacy editGuarantor handler to avoid unused warnings

  const saveGuarantor = (updated: Guarantor) => {
    setGuarantors((prev) => {
      const next = prev.map((g) => (g.id === updated.id ? updated : g));
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

  const [editGuarantorId, setEditGuarantorId] = useState<string | null>(null);
  const [guarantorDraft, setGuarantorDraft] = useState<{
    name: string;
    liability: number;
    coGuarantor?: string;
  } | null>(null);
  const openEditGuarantor = (id: string) => {
    const g = guarantors.find((x) => x.id === id);
    if (!g) return;
    setEditGuarantorId(id);
    setGuarantorDraft({
      name: g.name,
      liability: g.liability,
      coGuarantor:
        typeof g.coGuarantor === "boolean"
          ? String(g.coGuarantor)
          : g.coGuarantor,
    });
  };
  const saveEditGuarantor = (updates: {
    name: string;
    liability: number;
    coGuarantor?: string;
  }) => {
    if (!editGuarantorId) return;
    const updated: Guarantor = { id: editGuarantorId, ...updates } as Guarantor;
    saveGuarantor(updated);
    setEditGuarantorId(null);
    setGuarantorDraft(null);
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
      <div className="mb-2 rounded-md border bg-white dark:bg-blue-900 p-2 text-xs">
        <div className="flex gap-4">
          <span>
            Est. installment: {schedule[0]?.totalDue?.toLocaleString() || 0}
          </span>
          <span>Total interest: {totals.interest.toLocaleString()}</span>
          <span>Total fees: {totals.fees.toLocaleString()}</span>
          <span>Total payable: {totals.total.toLocaleString()}</span>
        </div>
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

      {editRepaymentId && repaymentDraft && (
        <EditRepaymentDialog
          open={true}
          onClose={() => {
            setEditRepaymentId(null);
            setRepaymentDraft(null);
          }}
          onSave={saveEditRepayment}
          amount={repaymentDraft.amount}
          method={repaymentDraft.method}
          notes={repaymentDraft.notes}
        />
      )}

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
      {editGuarantorId && guarantorDraft && (
        <EditGuarantorDialog
          open={true}
          onClose={() => {
            setEditGuarantorId(null);
            setGuarantorDraft(null);
          }}
          onSave={saveEditGuarantor}
          name={guarantorDraft.name}
          liability={guarantorDraft.liability}
          coGuarantor={guarantorDraft.coGuarantor}
        />
      )}
    </div>
  );
};

export default LoansView;
