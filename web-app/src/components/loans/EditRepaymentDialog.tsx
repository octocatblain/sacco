import { FC, useState } from "react";
import { Button } from "../ui/button";

interface EditRepaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: {
    amount: number;
    method?: string;
    notes?: string;
  }) => void;
  amount: number;
  method?: string;
  notes?: string;
}

const EditRepaymentDialog: FC<EditRepaymentDialogProps> = ({
  open,
  onClose,
  onSave,
  amount: initialAmount,
  method: initialMethod,
  notes: initialNotes,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount || 0);
  const [method, setMethod] = useState<string | undefined>(initialMethod);
  const [notes, setNotes] = useState<string | undefined>(initialNotes);

  const valid = amount > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-blue-900 p-4 shadow">
        <div className="text-lg font-semibold mb-3">Edit Repayment</div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {!valid && (
              <div className="text-xs text-red-600 mt-1">
                Amount must be greater than 0.
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-600">Method</label>
            <input
              type="text"
              value={method || ""}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Notes</label>
            <textarea
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!valid}
            onClick={() => onSave({ amount, method, notes })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRepaymentDialog;
