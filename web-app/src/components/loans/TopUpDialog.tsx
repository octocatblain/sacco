import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onTopUp: (amount: number) => void;
}

const TopUpDialog: FC<Props> = ({ onTopUp }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const submit = () => {
    if (amount > 0) {
      onTopUp(amount);
      setOpen(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Top Up
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
            <h3 className="text-lg font-semibold mb-3">Top Up Loan</h3>
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
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUpDialog;
