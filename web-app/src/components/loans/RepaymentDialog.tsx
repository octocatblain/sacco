import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan?: any;
  onRepay?: (amount: number, method?: string, notes?: string) => void;
}

const RepaymentDialog: FC<Props> = ({ open, onOpenChange, loan, onRepay }) => {
  const [amount, setAmount] = useState(loan?.amount || 0);
  const [method, setMethod] = useState("Cash");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setAmount(loan?.amount || 0);
  }, [loan]);

  const submit = () => {
    if (amount <= 0) return;
    if (onRepay) {
      onRepay(amount, method, notes);
    }
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
        <h3 className="text-lg font-semibold mb-3">Record Repayment</h3>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RepaymentDialog;
