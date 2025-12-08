import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiBaseUrl } from "@/constants";
import { useFetchSingleObject } from "@/hooks/useFetchSingleObject";
import { AccountProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Spinner from "@/components/Spinner";

const formSchema = z.object({
  customer: z.coerce.number().min(1, "Customer selection required"),
  account_type: z.string().min(1, "Account type is required"),
  status: z.string().optional(),
  balance: z.coerce.number().min(0, "Balance cannot be negative").optional(),
  interest_rate: z.coerce.number().min(0).optional(),
  maturity_date: z.string().optional(),
  kyc_completed: z.boolean().default(false),
  id_document: z.string().optional(),
});

const AccountsEdit = () => {
  const { accountNo } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: accountDetails } = useFetchSingleObject<AccountProps>(
    `accounts/${accountNo}`,
    !!accountNo
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { customer: 0, account_type: "", balance: 0, interest_rate: 0 },
  });

  useEffect(() => {
    if (accountDetails) form.reset(accountDetails);
  }, [accountDetails, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (accountNo) {
        await axios.patch(`${apiBaseUrl}/accounts/${accountNo}/`, values);
        toast.success("Account updated successfully");
      } else {
        await axios.post(`${apiBaseUrl}/accounts/`, values);
        toast.success("Account created successfully");
      }
      navigate("/accounts");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save account");
    } finally {
      setLoading(false);
    }
  };

  if (loading || (accountNo && !accountDetails)) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{accountNo ? "Edit Account" : "Create Account"}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Account & KYC Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="customer" render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl><Input {...field} type="number" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="account_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Savings">Regular Savings</SelectItem>
                      <SelectItem value="Voluntary">Voluntary Savings</SelectItem>
                      <SelectItem value="Fixed">Fixed Deposit</SelectItem>
                      <SelectItem value="Retirement">Retirement</SelectItem>
                      <SelectItem value="Joint">Joint</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {accountNo && (
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Dormant">Dormant</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="balance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="interest_rate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Account"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountsEdit;
