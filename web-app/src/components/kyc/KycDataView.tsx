import { FC, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { KycApplication } from "@/types";

const KycDataView: FC<{ apps: KycApplication[] }> = ({ apps }) => {
  const columns = useMemo<ColumnDef<KycApplication>[]>(
    () => [
      { header: "ID", accessorKey: "id" },
      {
        header: "Applicant",
        id: "applicant",
        accessorFn: (r) =>
          `${r.personal.firstName} ${r.personal.lastName}`.trim(),
      },
      { header: "Status", accessorKey: "status" },
      {
        header: "Docs",
        id: "docs",
        accessorFn: (r) => r.documents.length,
      },
      {
        header: "Email",
        id: "email",
        accessorFn: (r) => r.personal.email || "",
      },
      {
        header: "Phone",
        id: "phone",
        accessorFn: (r) => r.personal.phone || "",
      },
      {
        header: "Created",
        id: "createdAt",
        accessorFn: (r) => new Date(r.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const analytics = useMemo(() => {
    const total = apps.length;
    const byStatus = apps.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    const avgDocs = total
      ? apps.reduce((s, a) => s + a.documents.length, 0) / total
      : 0;
    return { total, byStatus, avgDocs };
  }, [apps]);

  const stat = (key: string) => analytics.byStatus[key] || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Total Applications</div>
          <div className="text-lg font-semibold">{analytics.total}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Submitted</div>
          <div className="text-lg font-semibold">{stat("submitted")}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">In Review</div>
          <div className="text-lg font-semibold">{stat("in_review")}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Approved</div>
          <div className="text-lg font-semibold">{stat("approved")}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Rejected</div>
          <div className="text-lg font-semibold">{stat("rejected")}</div>
        </div>
      </div>

      <DataTable<KycApplication, any>
        columns={columns}
        data={apps}
        title="KYC Applications"
        filters="status"
        reportHeading="KYC Applications"
      />
    </div>
  );
};

export default KycDataView;
