import { FC } from "react";
import { DataTable } from "@/components/data-table";

const Collections: FC = () => {
  const data = [
    {
      loanId: "L-101",
      borrower: "John Doe",
      daysPastDue: 45,
      bucket: "30-60",
      outstanding: 32000,
    },
    {
      loanId: "L-102",
      borrower: "Mary Jane",
      daysPastDue: 75,
      bucket: "60-90",
      outstanding: 45000,
    },
  ];
  const columns = [
    { header: "Loan", accessorKey: "loanId" },
    { header: "Borrower", accessorKey: "borrower" },
    { header: "DPD", accessorKey: "daysPastDue" },
    { header: "Bucket", accessorKey: "bucket" },
    { header: "Outstanding", accessorKey: "outstanding" },
  ];
  return (
    <DataTable
      columns={columns as any}
      data={data}
      title="Collections / NPL"
      filters="borrower"
      btnTitle={undefined as any}
      route={undefined as any}
      reportHeading="Collections Report"
    />
  );
};

export default Collections;
