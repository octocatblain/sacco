import { FC } from "react";
import { DataTable } from "@/components/data-table";

const Alerts: FC = () => {
  const data = [
    {
      type: "upcoming_due",
      message: "Installment due tomorrow",
      loanId: "L-1",
      createdAt: new Date().toISOString(),
    },
    {
      type: "overdue",
      message: "Installment overdue",
      loanId: "L-2",
      createdAt: new Date().toISOString(),
    },
  ];
  const columns = [
    { header: "Type", accessorKey: "type" },
    { header: "Message", accessorKey: "message" },
    { header: "Loan", accessorKey: "loanId" },
    { header: "Created", accessorKey: "createdAt" },
  ];
  return (
    <DataTable
      columns={columns as any}
      data={data}
      title="Loan Alerts"
      filters="type"
      btnTitle={undefined as any}
      route={undefined as any}
      reportHeading="Loan Alerts"
    />
  );
};

export default Alerts;
