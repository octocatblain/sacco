import { DataTable } from "@/components/data-table";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import type { JournalEntry, JournalLine, Account } from "@/types";

// Fake data for accounts and journals
const FAKE_ACCOUNTS: Account[] = [
  {
    id: 1,
    code: "1001",
    name: "Cash",
    type: "ASSET",
    currency: "KES",
    is_active: true,
  },
  {
    id: 2,
    code: "2001",
    name: "Accounts Payable",
    type: "LIABILITY",
    currency: "KES",
    is_active: true,
  },
];
const FAKE_JOURNALS: JournalEntry[] = [
  {
    id: 1,
    date: "2025-12-01",
    reference: "JV-001",
    narration: "Initial capital",
    posted: true,
    lines: [
      { account: 1, debit: 10000, credit: 0 },
      { account: 2, debit: 0, credit: 10000 },
    ],
  },
];

export default function Journals() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => FAKE_JOURNALS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<JournalEntry>({
    date: new Date().toISOString().slice(0, 10),
    reference: "",
    narration: "",
    posted: false,
    lines: [],
  });
  const [open, setOpen] = useState(false);
  const accounts = FAKE_ACCOUNTS;
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;

  // No localStorage or API, just fakedata

  const balanced = useMemo(() => {
    const d = (form.lines || []).reduce((s, l) => s + (l.debit || 0), 0);
    const c = (form.lines || []).reduce((s, l) => s + (l.credit || 0), 0);
    return Math.abs(d - c) < 0.005;
  }, [form]);

  const addLine = () =>
    setForm((prev) => ({
      ...prev,
      lines: [
        ...(prev.lines || []),
        { account: accounts[0]?.id, debit: 0, credit: 0 } as JournalLine,
      ],
    }));
  const updateLine = (idx: number, patch: Partial<JournalLine>) =>
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    }));
  const removeLine = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx),
    }));

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      reference: "",
      narration: "",
      posted: false,
      lines: [],
    });
    setEditingId(null);
  };

  const save = () => {
    if (!balanced || !form.lines.length)
      return alert("Journal must be balanced with at least one line");
    if (editingId !== null) {
      setEntries((prev) =>
        prev.map((e) =>
          (e as any).id === editingId ? { ...form, id: editingId } : e
        )
      );
    } else {
      const id = Date.now();
      setEntries((prev) => [{ ...form, id }, ...prev]);
    }
    resetForm();
    setOpen(false);
  };

  const startEdit = (e: JournalEntry) => {
    setEditingId((e as any).id as number);
    setForm({ ...e });
    setOpen(true);
  };
  const del = (id: number) =>
    setEntries((prev) => prev.filter((e) => (e as any).id !== id));

  const columns = useMemo(
    () => [
      { header: "Date", accessorKey: "date" },
      { header: "Reference", accessorKey: "reference" },
      {
        header: "Lines",
        id: "lines",
        accessorFn: (r: JournalEntry) => r.lines.length,
      },
      { header: "Posted", accessorKey: "posted" },
      { header: "Narration", accessorKey: "narration" },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }: any) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEdit(row.original)}
            >
              View/Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => del((row.original as any).id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [entries]
  ) as any;

  const debitSum = (form.lines || []).reduce((s, l) => s + (l.debit || 0), 0);
  const creditSum = (form.lines || []).reduce((s, l) => s + (l.credit || 0), 0);

  // persist entries
  useMemo(() => {
    saveJournals(entries);
    return entries;
  }, [entries]);

  return (
    <div className="space-y-4">
      <Breadcrumb
        title="Journals"
        description="Record and review journal entries"
        homePath="/"
      />
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          disabled={!hasAccounts}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          New Entry
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Entries</div>
          <div className="text-lg font-semibold">{entries.length}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Lines</div>
          <div className="text-lg font-semibold">
            {entries.reduce((s, e) => s + e.lines.length, 0)}
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-4xl rounded-md bg-white p-4 dark:bg-blue-900">
            <h2 className="font-semibold mb-3">
              {editingId ? "Edit Entry" : "New Entry"}
            </h2>
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm">Reference</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.reference || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reference: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Narration</label>
                <input
                  className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
                  value={form.narration || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, narration: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Lines</h3>
                <Button size="sm" disabled={!hasAccounts} onClick={addLine}>
                  Add Line
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-sm font-medium">
                <div>Account</div>
                <div className="col-span-3">Memo</div>
                <div className="text-right">Debit</div>
                <div className="text-right">Credit</div>
                <div></div>
              </div>
              {(form.lines || []).map((l, idx) => (
                <div key={idx} className="grid grid-cols-7 gap-2">
                  <select
                    className="border rounded px-2 py-1 dark:bg-blue-950"
                    value={l.account ?? (hasAccounts ? accounts[0].id : 0)}
                    onChange={(e) =>
                      updateLine(idx, { account: Number(e.target.value) })
                    }
                    disabled={!hasAccounts}
                  >
                    {hasAccounts ? (
                      accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.code} - {a.name}
                        </option>
                      ))
                    ) : (
                      <option value={0}>No accounts available</option>
                    )}
                  </select>
                  <input
                    className="col-span-3 border rounded px-2 py-1 dark:bg-blue-950"
                    value={l.memo || ""}
                    onChange={(e) => updateLine(idx, { memo: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="text-right border rounded px-2 py-1 dark:bg-blue-950"
                    value={l.debit || 0}
                    onChange={(e) =>
                      updateLine(idx, {
                        debit: Number(e.target.value) || 0,
                        credit: 0,
                      })
                    }
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="text-right border rounded px-2 py-1 dark:bg-blue-950"
                    value={l.credit || 0}
                    onChange={(e) =>
                      updateLine(idx, {
                        credit: Number(e.target.value) || 0,
                        debit: 0,
                      })
                    }
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeLine(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-7 gap-2 mt-2">
                <div className="col-start-5 text-right font-semibold">
                  {debitSum.toFixed(2)}
                </div>
                <div className="text-right font-semibold">
                  {creditSum.toFixed(2)}
                </div>
                <div
                  className={`text-sm ${
                    balanced ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {balanced ? "Balanced" : "Out of balance"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={save}>{editingId ? "Update" : "Save"}</Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={entries}
        title="Journal Entries"
        filters="reference"
        reportHeading="Journal Entries"
      />
    </div>
  );
}
