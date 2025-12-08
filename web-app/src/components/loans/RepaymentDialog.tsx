import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Repayment } from "@/types";

interface Props {
  onRepay?: (amount: number, method?: string, notes?: string) => void;
  onSave?: (r: Repayment) => void;
  repayment?: Repayment;
  triggerLabel?: string;
}

const RepaymentDialog: FC<Props> = ({
  onRepay,
  onSave,
  repayment,
  triggerLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(repayment?.amount || 0);
  const [method, setMethod] = useState(repayment?.method || "Cash");
  const [notes, setNotes] = useState(repayment?.notes || "");

  const submit = () => {
    if (amount <= 0) return;
    if (repayment && onSave) {
      onSave({ ...repayment, amount, method, notes });
    } else if (onRepay) {
      onRepay(amount, method, notes);
    }
    setOpen(false);
  };

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel || (repayment ? "Edit Repayment" : "Record Repayment")}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
            <h3 className="text-lg font-semibold mb-3">
              {repayment ? "Edit Repayment" : "Record Repayment"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Amount</label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm">Method</label>
                <select
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>Bank</option>
                  <option>Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Notes</label>
                <textarea
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              {amount <= 0 ? (
                <p className="text-xs text-red-600">Enter a positive amount.</p>
              ) : null}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={submit}>
                {repayment ? "Save" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepaymentDialog;
