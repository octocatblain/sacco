import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onDisburse: (amount: number, channel?: string) => void;
}

const DisburseDialog: FC<Props> = ({ onDisburse }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [channel, setChannel] = useState("Bank");

  const submit = () => {
    if (amount > 0) {
      onDisburse(amount, channel);
      setOpen(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Disburse
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
            <h3 className="text-lg font-semibold mb-3">Disburse Loan</h3>
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
                <label className="text-sm">Channel</label>
                <select
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  <option>Bank</option>
                  <option>Mobile Money</option>
                  <option>Cash</option>
                </select>
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
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisburseDialog;
