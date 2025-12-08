// src/pages/customers/Customers.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetch } from "@/hooks/useDataFetch";
import { CustomerProps } from "@/types";
import { DataTable } from "@/components/data-table";
import LucideIcon from "@/components/LucideIcon";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const columns: ColumnDef<CustomerProps>[] = [
  {
    accessorKey: "id",
    header: "Member ID",
    cell: ({ row }) => (
      <Link to={`/customers/view/${row.original.id}`} className="font-medium text-blue-600 hover:underline">
        M{String(row.original.id).padStart(6, "0")}
      </Link>
    ),
  },
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => `${row.original.salutation} ${row.original.first_name} ${row.original.last_name}`,
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "kyc_status",
    header: "KYC",
    cell: ({ row }) => <Badge variant={row.original.kyc_status === "Verified" ? "default" : "secondary"}>
      {row.original.kyc_status || "Pending"}
    </Badge>,
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => row.original.created_at ? format(new Date(row.original.created_at), "dd MMM yyyy") : "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-3">
        <Link to={`/customers/view/${row.original.id}`}><LucideIcon name="Eye" size={18} /></Link>
        <Link to={`/customers/edit/${row.original.id}`}><LucideIcon name="Pen" size={17} /></Link>
      </div>
    ),
  },
];

const Customers = () => {
  const { data, loading, error } = useDataFetch<CustomerProps[]>("customers");

  if (loading) return <div className="w-full min-h-screen flex justify-center items-center"><Spinner /></div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">Digital KYC • Full member management</p>
        </div>
        <Link to="/customers/edit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
          Register Member
        </Link>
      </div>

      <DataTable
        title="All Members"
        data={data?.[0] || []}
        columns={columns}
        filters="id,first_name,last_name,phone_number"
        searchable
        exportable
      />
    </div>
  );
};

export default Customers;