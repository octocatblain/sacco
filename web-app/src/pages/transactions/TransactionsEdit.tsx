import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";

// Double-entry schema
const transactionLineSchema = z.object({
  account: z.string().nonempty("Account is required"),
  amount: z.number().min(1, "Amount must be greater than zero"),
  drcr: z.enum(["DR", "CR"]),
});

const formSchema = z.object({
  customerId: z.string().nonempty("Customer ID is required"),
  transaction_type: z.enum(["deposit", "withdrawal", "transfer"]),
  date: z.date(),
  entries: z.array(transactionLineSchema).min(2, "At least two entries required for double-entry"),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionsEdit = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_type: "deposit",
      date: new Date(),
      entries: [
        { account: "", amount: 0, drcr: "DR" },
        { account: "", amount: 0, drcr: "CR" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // TODO: Validate KYC
      // await checkKYC(values.customerId);

      // TODO: Post to GL
      // await postToGL(values);

      alert("Double-entry transaction posted successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-medium mb-5">Create Double-Entry Transaction</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-50 p-5 rounded-md shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Customer ID */}
            <FormField control={form.control} name="customerId" render={({ field }) => (
              <FormItem>
                <FormLabel>Customer ID</FormLabel>
                <FormControl><Input {...field} placeholder="Enter Customer ID" /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            {/* Transaction Type */}
            <FormField control={form.control} name="transaction_type" render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}/>

            {/* Date */}
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {field.value ? format(field.value, "PPP") : "Select date"}{" "}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}/>
          </div>

          {/* Double-entry lines */}
          <div className="space-y-4 mt-5">
            <h2 className="text-lg font-medium">Transaction Entries (Debit/Credit)</h2>
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
                <FormField control={form.control} name={`entries.${index}.account`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <FormControl><Input {...field} placeholder="Account Number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`entries.${index}.amount`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl><Input type="number" {...field} placeholder="Amount" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`entries.${index}.drcr`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>DR/CR</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select DR/CR" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DR">Debit</SelectItem>
                        <SelectItem value="CR">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ account: "", amount: 0, drcr: "DR" })}>Add Entry</Button>
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Post Transaction"}
            </Button>
            <Button type="button" onClick={() => form.reset()}>Reset</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TransactionsEdit;
