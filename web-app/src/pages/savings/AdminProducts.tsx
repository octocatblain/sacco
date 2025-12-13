"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import type { SavingsProduct } from "@/types";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LucideIcon from "@/components/LucideIcon";

const initialProducts: any[] = [
  {
    id: "SP-001",
    name: "Voluntary Savings",
    type: "voluntary",
    minContribution: 500,
    maxContribution: 50000,
    interestRate: 0.05,
    standingOrderAllowed: true,
    description: "Flexible savings for any purpose.",
  },
  {
    id: "SP-002",
    name: "Mandatory Savings",
    type: "mandatory",
    minContribution: 1000,
    maxContribution: 10000,
    interestRate: 0.03,
    description: "Required monthly savings for all members.",
  },
  {
    id: "SP-003",
    name: "Retirement Savings",
    type: "retirement",
    minContribution: 2000,
    maxContribution: 100000,
    interestRate: 0.07,
    penaltyRule: { graceDays: 5, penaltyRate: 0.02 },
    description:
      "Long-term savings for retirement with penalties for late payments.",
  },
  {
    id: "SP-004",
    name: "Education Fund",
    type: "education",
    minContribution: 1500,
    maxContribution: 30000,
    interestRate: 0.045,
    description: "Save for your children's education.",
  },
  {
    id: "SP-005",
    name: "Holiday Savings",
    type: "voluntary",
    minContribution: 500,
    maxContribution: 20000,
    interestRate: 0.04,
    description: "Plan ahead for holidays and festivities.",
  },
];

type DialogType =
  | null
  | { type: "add" }
  | { type: "edit"; product: SavingsProduct }
  | { type: "view"; product: SavingsProduct }
  | { type: "delete"; product: SavingsProduct };

const ProductDialog: FC<{
  open: boolean;
  type: "add" | "edit" | "view";
  product?: SavingsProduct;
  onClose: () => void;
  onSave?: (product: SavingsProduct) => void;
}> = ({ open, type, product, onClose, onSave }) => {
  const [form, setForm] = useState<any>(
    product || {
      id: "",
      name: "",
      type: "voluntary",
      minContribution: 0,
      maxContribution: 0,
      interestRate: 0,
      description: "",
    }
  );
  // Update form when product changes
  useEffect(() => {
    if (product) setForm(product);
    else
      setForm({
        id: "",
        name: "",
        type: "voluntary",
        minContribution: 0,
        maxContribution: 0,
        interestRate: 0,
        description: "",
      });
  }, [product, open]);
  if (!open) return null;
  const isView = type === "view";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded bg-white dark:bg-blue-900 p-6">
        <h2 className="text-lg font-semibold mb-4">
          {type === "add"
            ? "Add Product"
            : type === "edit"
            ? "Edit Product"
            : "Product Details"}
        </h2>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (onSave) onSave(form);
            onClose();
          }}
        >
          <div>
            <label className="block text-xs mb-1">Name</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={form.name}
              disabled={isView}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Type</label>
            <select
              className="w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={form.type}
              disabled={isView}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="voluntary">Voluntary</option>
              <option value="mandatory">Mandatory</option>
              <option value="retirement">Retirement</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs mb-1">Min Contribution</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.minContribution}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({
                    ...f,
                    minContribution: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1">Max Contribution</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 dark:bg-blue-950"
                value={form.maxContribution}
                disabled={isView}
                onChange={(e) =>
                  setForm((f: any) => ({
                    ...f,
                    maxContribution: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={form.interestRate * 100}
              disabled={isView}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  interestRate: Number(e.target.value) / 100,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Description</label>
            <textarea
              className="w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={form.description || ""}
              disabled={isView}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {!isView && (
              <Button type="submit" size="sm">
                Save
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmDialog: FC<{
  open: boolean;
  onClose: (confirmed: boolean) => void;
  message: string;
}> = ({ open, onClose, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-xs rounded bg-white dark:bg-blue-900 p-6">
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onClose(true)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts: FC = () => {
  const [products, setProducts] = useState<SavingsProduct[]>(initialProducts);
  const [dialog, setDialog] = useState<DialogType>(null);

  const columns = [
    { header: "Product ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "type" },
    { header: "Min", accessorKey: "minContribution" },
    { header: "Max", accessorKey: "maxContribution" },
    { header: "Rate", accessorKey: "interestRate" },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="rounded-full">
              <LucideIcon name="Pen" className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setDialog({ type: "view", product: row.original })}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDialog({ type: "edit", product: row.original })}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setDialog({ type: "delete", product: row.original })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const metrics = useMemo(() => {
    const count = products.length;
    const avgRate =
      Math.round(
        (products.reduce((a, p) => a + (p.interestRate || 0), 0) /
          Math.max(count, 1)) *
          1000
      ) / 1000;
    return { count, avgRate };
  }, [products]);

  const handleAdd = () => setDialog({ type: "add" });
  const handleSave = (product: SavingsProduct) => {
    setProducts((prev) => {
      if (dialog && dialog.type === "edit" && dialog.product) {
        // Edit
        return prev.map((p) =>
          p.id === dialog.product!.id ? { ...product, id: p.id } : p
        );
      } else {
        // Add
        return [
          { ...product, id: `SP-${Math.floor(Math.random() * 900 + 100)}` },
          ...prev,
        ];
      }
    });
  };
  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <Breadcrumb
        title="Savings Products"
        description="Manage your savings products catalog"
        homePath="/dashboard"
      />

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Savings Products</h1>
        <Button size="sm" onClick={handleAdd}>
          Add Product
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total products</div>
          <div className="text-lg font-semibold">{metrics.count}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Average rate</div>
          <div className="text-lg font-semibold">
            {(metrics.avgRate * 100).toFixed(2)}%
          </div>
        </div>
      </div>
      <DataTable
        columns={columns as any}
        data={products}
        title="Savings Products Catalog"
        filters="name"
        btnTitle={undefined as any}
        route={undefined as any}
        reportHeading="Savings Products"
      />
      {/* Dialogs */}
      {dialog &&
        (dialog.type === "add" ||
          dialog.type === "edit" ||
          dialog.type === "view") && (
          <ProductDialog
            open={true}
            type={dialog.type}
            product={dialog.type !== "add" ? dialog.product : undefined}
            onClose={() => setDialog(null)}
            onSave={
              dialog.type !== "view"
                ? (p) => {
                    handleSave(p);
                    setDialog(null);
                  }
                : undefined
            }
          />
        )}
      {dialog && dialog.type === "delete" && (
        <ConfirmDialog
          open={true}
          message={`Are you sure you want to delete "${dialog.product.name}"?`}
          onClose={(confirmed) => {
            if (confirmed) handleDelete(dialog.product.id);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;
