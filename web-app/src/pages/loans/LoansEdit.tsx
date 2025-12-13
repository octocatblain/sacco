import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  account: z.string(),
  customerId: z.coerce.number(),
  first_name: z.string(),
  last_name: z.string(),
  loan_type: z.string().refine((val) => val !== "", { message: "Please select a loan type" }),
  amount: z.coerce.number(),
  interest_type: z.enum(["flat", "reducing", "fixed"]),
  guarantor: z.string().optional(),
  co_guarantor: z.string().optional(),
  date: z.date(),
  due_date: z.date(),
  auto_calculate_interest: z.boolean().optional(),
  send_alerts: z.boolean().optional(),
});

const LoansEdit = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auto_calculate_interest: true,
      send_alerts: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Auto-calculate interest based on type
    const interest = calculateInterest(values.amount, values.interest_type);
    console.log({ ...values, interest });
    // TODO: call API to save loan, post transactions, notify guarantors
  };

  const calculateInterest = (amount: number, type: "flat" | "reducing" | "fixed") => {
    switch (type) {
      case "flat":
        return amount * 0.1; // 10% flat as example
      case "reducing":
        return amount * 0.1 * 0.9; // Example reducing balance
      case "fixed":
        return amount * 0.12; // Fixed 12%
      default:
        return 0;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium">New Loan</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer Details */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <FormField control={form.control} name="account" render={({ field }) => (
                <FormItem>
                  <FormLabel>Account No</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="customerId" render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="first_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="last_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md">
            <div className="text-lg font-medium">Loan Details</div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <FormField control={form.control} name="loan_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a loan type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="interest_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="reducing">Reducing</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="guarantor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Guarantor</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="co_guarantor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Guarantor (Optional)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] text-left">
                        {field.value ? format(field.value, "PPP") : "Pick a date"}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="due_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] text-left">
                        {field.value ? format(field.value, "PPP") : "Pick a date"}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="ml-auto">Disburse</Button>
            <Button type="submit">Save Draft</Button>
            <Button type="button">Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoansEdit;
