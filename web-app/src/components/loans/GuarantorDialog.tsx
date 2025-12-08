import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Guarantor } from "@/types";

interface Props {
  onAdd?: (g: Guarantor) => void;
  onSave?: (g: Guarantor) => void;
  guarantor?: Guarantor;
  triggerLabel?: string;
}

const GuarantorDialog: FC<Props> = ({
  onAdd,
  onSave,
  guarantor,
  triggerLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(guarantor?.name || "");
  const [liability, setLiability] = useState(guarantor?.liability || 0);
  const [co, setCo] = useState(guarantor?.coGuarantor || false);

  const submit = () => {
    if (!name || liability <= 0) return;
    const payload: Guarantor = {
      id: guarantor?.id || `g${Date.now()}`,
      name,
      liability,
      coGuarantor: co,
    };
    if (guarantor && onSave) {
      onSave(payload);
    } else if (onAdd) {
      onAdd(payload);
    }
    setOpen(false);
    if (!guarantor) {
      setName("");
      setLiability(0);
      setCo(false);
    }
  };

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel || (guarantor ? "Edit Guarantor" : "Add Guarantor")}
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-md bg-white p-4 dark:bg-blue-900">
            <h3 className="text-lg font-semibold mb-3">
              {guarantor ? "Edit Guarantor" : "Add Guarantor"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Name</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">Liability</label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={liability}
                  onChange={(e) => setLiability(Number(e.target.value))}
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={co}
                  onChange={(e) => setCo(e.target.checked)}
                />
                Co-Guarantor
              </label>
              {!name || liability <= 0 ? (
                <p className="text-xs text-red-600">
                  Enter a name and positive liability.
                </p>
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
                {guarantor ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuarantorDialog;
