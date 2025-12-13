import { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const initialSystemSettings = [
  { key: "System Name", value: "K2AN" },
  { key: "Maintenance Mode", value: "Off" },
  { key: "Default Currency", value: "KES" },
  { key: "Backup Frequency", value: "Weekly" },
  { key: "API Access", value: "Enabled" },
  { key: "Max Users", value: "1000" },
  { key: "Data Retention", value: "1 year" },
  { key: "Audit Logging", value: "On" },
];

const SystemSettings = () => {
  const [systemSettings, setSystemSettings] = useState(initialSystemSettings);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  const handleEdit = (setting: any) => {
    setSelected(setting);
    setInputValue(setting.value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setInputValue("");
  };

  const handleSave = () => {
    if (selected) {
      setSystemSettings((prev) =>
        prev.map((s) =>
          s.key === selected.key ? { ...s, value: inputValue } : s
        )
      );
    }
    handleClose();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">System Settings</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Setting</th>
            <th className="py-2">Value</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {systemSettings.map((setting) => (
            <tr key={setting.key} className="border-b">
              <td className="py-2">{setting.key}</td>
              <td className="py-2">{setting.value}</td>
              <td className="py-2">
                <Button onClick={() => handleEdit(setting)} size="sm">
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle>Edit Setting</DialogTitle>
        <DialogContent>
          {selected && (
            <div>
              <div className="mb-2 font-medium">{selected.key}</div>
              <input
                className="border rounded px-2 py-1 w-full"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          )}
        </DialogContent>
        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={handleClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default SystemSettings;
