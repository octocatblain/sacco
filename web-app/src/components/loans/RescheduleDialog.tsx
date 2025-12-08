import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { calcSchedule } from "@/lib/loanMath";

interface Props {
  initialRate: number;
  initialTermMonths: number;
  onReschedule: (annualRate: number, termMonths: number) => void;
}

const RescheduleDialog: FC<Props> = ({
  initialRate,
  initialTermMonths,
  onReschedule,
}) => {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(initialRate);
  const [term, setTerm] = useState(initialTermMonths);
  const ratePct = rate * 100;
  const validRate = ratePct >= 0 && ratePct <= 50;
  const validTerm = term >= 1 && term <= 120;

  const submit = () => {
    if (validRate && validTerm) {
      onReschedule(rate, term);
      setOpen(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Reschedule
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
            <h3 className="text-lg font-semibold mb-3">Reschedule Loan</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Annual Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={ratePct.toFixed(2)}
                  onChange={(e) => setRate(Number(e.target.value) / 100)}
                />
                {!validRate ? (
                  <p className="text-xs text-red-600">
                    Rate should be 0% - 50%.
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Reasonable rates keep repayments manageable.
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Term (months)</label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                />
                {!validTerm ? (
                  <p className="text-xs text-red-600">
                    Term should be between 1 and 120 months.
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Longer terms reduce installments but raise total interest.
                  </p>
                )}
              </div>
              {/* Preview totals */}
              <PreviewTotals principal={100000} rate={rate} term={term} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submit}
                disabled={!validRate || !validTerm}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewTotals: FC<{ principal: number; rate: number; term: number }> = ({
  principal,
  rate,
  term,
}) => {
  const schedule = calcSchedule({
    principal,
    annualRate: rate,
    termMonths: term,
  });
  const interest =
    Math.round(schedule.reduce((a, s) => a + s.interest, 0) * 100) / 100;
  const fees = Math.round(schedule.reduce((a, s) => a + s.fees, 0) * 100) / 100;
  const total =
    Math.round(schedule.reduce((a, s) => a + s.totalDue, 0) * 100) / 100;
  const installment = schedule[0]?.totalDue || 0;
  return (
    <div className="mt-2 rounded border p-2 text-xs">
      <div className="flex gap-4">
        <span>Est. installment: {installment.toLocaleString()}</span>
        <span>Total interest: {interest.toLocaleString()}</span>
        <span>Total fees: {fees.toLocaleString()}</span>
        <span>Total payable: {total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default RescheduleDialog;
