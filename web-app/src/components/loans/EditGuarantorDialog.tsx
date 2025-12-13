import { FC, useState } from "react";
import { Button } from "../ui/button";

interface EditGuarantorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: {
    name: string;
    liability: number;
    coGuarantor?: string;
  }) => void;
  name: string;
  liability: number;
  coGuarantor?: string;
}

const EditGuarantorDialog: FC<EditGuarantorDialogProps> = ({
  open,
  onClose,
  onSave,
  name: initialName,
  liability: initialLiability,
  coGuarantor: initialCoGuarantor,
}) => {
  const [name, setName] = useState<string>(initialName || "");
  const [liability, setLiability] = useState<number>(initialLiability || 0);
  const [coGuarantor, setCoGuarantor] = useState<string | undefined>(
    initialCoGuarantor
  );

  const valid = name.trim().length > 1 && liability > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-blue-900 p-4 shadow">
        <div className="text-lg font-semibold mb-3">Edit Guarantor</div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {name.trim().length <= 1 && (
              <div className="text-xs text-red-600 mt-1">
                Name must be at least 2 characters.
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-600">Liability</label>
            <input
              type="number"
              min={1}
              value={liability}
              onChange={(e) => setLiability(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2"
            />
            {liability <= 0 && (
              <div className="text-xs text-red-600 mt-1">
                Liability must be greater than 0.
              </div>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-600">Co-Guarantor</label>
            <input
              type="text"
              value={coGuarantor || ""}
              onChange={(e) => setCoGuarantor(e.target.value)}
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
            onClick={() => onSave({ name, liability, coGuarantor })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditGuarantorDialog;
