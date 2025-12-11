import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
// types
import { AccountProps } from "@/types";
// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";

// form schema validation with zod
const formSchema = z.object({
  // customer: z.string(coerce.number()),
  customer: z.coerce.number().min(1, {
    message: "Required",
  }),
  account_type: z.string().refine((value) => value !== "", {
    message: "Required",
  }),
  // status: z.string().refine((value) => value !== "", {
  //   message: "Required",
  // }),
  status: z.string().optional(),
});

const AccountsEdit = () => {
  const { accountNo } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fakedata for account details
  let accountNumberValue = 1001;
  if (accountNo && /^[0-9]+$/.test(accountNo)) {
    accountNumberValue = Number(accountNo);
  }
  const FAKE_ACCOUNT: AccountProps = {
    account_number: accountNumberValue,
    customer: 1,
    account_type: "Savings",
    balance: 5000,
    status: "Active",
    date_opened: new Date("2023-01-01"),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: FAKE_ACCOUNT.customer,
      account_type: FAKE_ACCOUNT.account_type,
      status: FAKE_ACCOUNT.status,
    },
  });

  // handle form submit
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Fakedata submit:", values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/accounts");
    }, 1000);
  };

  return (
    <div>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-medium">New Account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-5">
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer ID.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="!focus-visible:ring-0 !focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="account_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => v != "" && field.onChange(v)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Savings">Savings</SelectItem>
                            <SelectItem value="Current">Current</SelectItem>
                            <SelectItem value="Fixed">Fixed</SelectItem>
                            <SelectItem value="Joint">Joint</SelectItem>
                            <SelectItem value="Corporate">Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {accountNo && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Status</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => v != "" && field.onChange(v)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                              <SelectItem value="Dormant">Dormant</SelectItem>
                              <SelectItem value="Suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );