import { FC, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import type { SavingsProduct } from "@/types";
import { Button } from "@/components/ui/button";

const initialProducts: SavingsProduct[] = [
  {
    id: "SP-001",
    name: "Voluntary Savings",
    type: "voluntary",
    minContribution: 500,
    maxContribution: 50000,
    interestRate: 0.05,
    standingOrderAllowed: true,
  },
  {
    id: "SP-002",
    name: "Mandatory Savings",
    type: "mandatory",
    minContribution: 1000,
    maxContribution: 10000,
    interestRate: 0.03,
  },
  {
    id: "SP-003",
    name: "Retirement Savings",
    type: "retirement",
    minContribution: 2000,
    maxContribution: 100000,
    interestRate: 0.07,
    penaltyRule: { graceDays: 5, penaltyRate: 0.02 },
  },
];

const AdminProducts: FC = () => {
  const [products, setProducts] = useState<SavingsProduct[]>(initialProducts);
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
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => editProduct(row.original.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeProduct(row.original.id)}
          >
            Remove
          </Button>
        </div>
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

  const addProduct = () => {
    const id = `SP-${String(Math.floor(Math.random() * 900) + 100)}`;
    setProducts((prev) => [
      {
        id,
        name: "New Product",
        type: "custom",
        minContribution: 0,
        maxContribution: 0,
        interestRate: 0,
      },
      ...prev,
    ]);
  };
  const editProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: p.name + " *" } : p))
    );
  };
  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Savings Products</h1>
        <Button size="sm" onClick={addProduct}>
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
    </div>
  );
};

export default AdminProducts;
