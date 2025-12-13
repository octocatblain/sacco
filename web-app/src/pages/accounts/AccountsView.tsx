import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";

// Demo: fake account data
const FAKE_ACCOUNTS: any[] = [
  {
    account_number: 1001,
    customer: 1,
    customer_name: "Sipho Nkosi",
    account_type: "Savings",
    balance: 5000,
    status: "Active",
    date_opened: new Date("2023-01-01"),
    interest_rate: 2.5,
    maturity_date: "2025-01-01",
    kyc_completed: true,
    id_document: "National ID",
  },
  // ... more fake accounts ...
];

const AccountsView = () => {
  const { accountNo } = useParams();
  const account =
    FAKE_ACCOUNTS.find((a) => String(a.account_number) === String(accountNo)) ||
    FAKE_ACCOUNTS[0];

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <div className="flex gap-2 text-sm mt-2">
          <Badge className="bg-blue-100 text-blue-800">
            {account.account_type}
          </Badge>
          <Badge className="bg-gray-100 text-gray-800">{account.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <b>Account Number:</b> {account.account_number.toLocaleString()}
          </div>
          <div>
            <b>Member Name:</b> {account.customer_name}
          </div>
          <div>
            <b>Balance:</b> {account.balance.toLocaleString()}
          </div>
          <div>
            <b>Date Opened:</b> {account.date_opened.toLocaleDateString()}
          </div>
          <div>
            <b>Interest Rate:</b> {account.interest_rate}%
          </div>
          <div>
            <b>Maturity Date:</b> {account.maturity_date}
          </div>
          <div>
            <b>KYC Completed:</b> {account.kyc_completed ? "Yes" : "No"}
          </div>
          <div>
            <b>ID Document:</b> {account.id_document}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Link
            to={`/accounts/edit/${account.account_number}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            to="/accounts"
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Back to Accounts
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsView;
