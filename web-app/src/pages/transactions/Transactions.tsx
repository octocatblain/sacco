import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useDataFetch } from "@/hooks/useDataFetch";
//import { postToGL } from "@/services/accounting"; // hypothetical GL service
//import { sendMobileAlert } from "@/services/notifications"; // hypothetical mobile notifications
//import { checkKYC } from "@/services/kyc"; // hypothetical KYC validation
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
// types
import { TransactionProps } from "@/types";

const columns: ColumnDef<TransactionProps>[] = [
  {
    header: "Customer ID",
    cell: ({ row }) => {
      return (
        <div>
          <Link to={`/customers/view/${row.original.customer_id}`}>
            {row.original.customer_id}
          </Link>
        </div>
      );
    },
  },
  { accessorKey: "account", header: "Account" },
  { accessorKey: "transaction_type", header: "Transaction Type" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "transaction_date", header: "Transaction Date" },
  { accessorKey: "posted_to_gl", header: "GL Posted" },
  { accessorKey: "mobile_alert_sent", header: "Mobile Alert" },
  { accessorKey: "audit_trail", header: "Audit Trail" },
];

const Transactions = () => {
  const { data, loading, error} = useDataFetch<TransactionProps>("transactions");

  // Handle posting a new transaction
  const handleTransaction = async (transaction: TransactionProps) => {
    try {
      // 1. Validate KYC
      

      // 4. Refresh data table
      
      alert("Transaction successful and posted to GL!");
    } catch (err) {
      console.error("Transaction error:", err);
      alert("Transaction failed. Check console for details.");
    }
  };

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        Error : {error.message}
      </div>
    );

  return (
    <div>
      <DataTable
        title="Transactions"
        route="/transactions/edit"
        btnTitle="Create Transaction"
        data={data}
        columns={columns}
        filters="account"
        searchable
        exportable
        //onRowAction={handleTransaction} // Example: trigger on approve/disburse
      />
    </div>
  );
};

export default Transactions;
