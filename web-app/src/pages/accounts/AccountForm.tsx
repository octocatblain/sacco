import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AccountForm = ({
  onSubmit,
  defaultValues = {},
}: {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}) => {
  const [form, setForm] = useState({
    customer: defaultValues.customer || "",
    account_type: defaultValues.account_type || "",
    status: defaultValues.status || "Active",
    balance: defaultValues.balance || "",
    interest_rate: defaultValues.interest_rate || "",
    maturity_date: defaultValues.maturity_date || "",
    kyc_completed: defaultValues.kyc_completed || false,
    id_document: defaultValues.id_document || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="customer"
          placeholder="Customer ID"
          value={form.customer}
          onChange={handleChange}
        />
        <Select
          value={form.account_type}
          onValueChange={(v) => handleSelect("account_type", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Savings">Savings</SelectItem>
            <SelectItem value="Current">Current</SelectItem>
            <SelectItem value="Fixed">Fixed</SelectItem>
            <SelectItem value="Joint">Joint</SelectItem>
            <SelectItem value="Corporate">Corporate</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={form.status}
          onValueChange={(v) => handleSelect("status", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Dormant">Dormant</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="balance"
          type="number"
          placeholder="Balance"
          value={form.balance}
          onChange={handleChange}
        />
        <Input
          name="interest_rate"
          type="number"
          placeholder="Interest Rate (%)"
          value={form.interest_rate}
          onChange={handleChange}
        />
        <Input
          name="maturity_date"
          type="date"
          placeholder="Maturity Date"
          value={form.maturity_date}
          onChange={handleChange}
        />
        <Input
          name="id_document"
          placeholder="ID Document"
          value={form.id_document}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default AccountForm;
