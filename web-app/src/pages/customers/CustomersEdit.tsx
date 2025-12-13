// src/pages/customers/CustomersEdit.tsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, UserPlus, Trash2, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
// components
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  // components
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb";
// types
import { CustomerProps } from "@/types";
import { toast } from "react-toastify";

/**
 * Schema
 *
 * - KYC fields added
 * - Guarantors array (Option B - detailed)
 * - File uploads for ID and supporting documents
 */
const guarantorSchema = z.object({
  name: z.string().min(2, { message: "Guarantor name required" }),
  id_number: z.string().min(2, { message: "ID number required" }),
  phone: z.string().min(2, { message: "Phone required" }),
  email: z.string().email({ message: "Enter valid email" }).optional(),
  address: z.string().optional(),
  relationship: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
});

const formSchema = z.object({
  salutation: z.string().refine((value) => value !== "", {
    message: "Please select an option.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middle_name: z.string().min(2, {
    message: "Middle name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  id_number: z.string().max(50).min(2, { message: "ID number is required" }),
  phone_number: z.string({ required_error: "Phone number is required" }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  date_of_birth: z.date({
    required_error: "A date of birth is required.",
  }),
  tax_number: z.string({ required_error: "Tax number is required" }),
  country: z.string({ required_error: "Country is required" }),
  county: z.string({ required_error: "County is required" }),
  city: z.string({ required_error: "City is required" }),
  po_box: z.coerce.number().min(0, { message: "P.O Box required" }),

  // KYC
  kyc_level: z.string().min(1, { message: "KYC Level is required" }),
  kyc_status: z.string().min(1, { message: "KYC Status is required" }),
  kyc_expiry: z.date({ required_error: "KYC expiry date is required." }),

  // Guarantors - Option B (detailed)
  guarantors: z.array(guarantorSchema).optional(),

  // File uploads
  id_document: z
    .any()
    .refine((file) => file instanceof File, "ID document is required"),
  supporting_documents: z
    .array(z.any())
    .optional()
    .refine(
      (files) =>
        !files || files.every((f: File) => f.type === "application/pdf"),
      "Supporting documents must be PDFs"
    ),
});

type FormValues = z.infer<typeof formSchema>;

const CustomersEdit = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Fakedata for customer details
  const FAKE_CUSTOMER: CustomerProps = {
    id: customerId ? Number(customerId) : 1,
    first_name: "John",
    last_name: "Doe",
    middle_name: "M.",
    salutation: "Mr.",
    email: "john@example.com",
    phone_number: "0712345678",
    id_number: "12345678",
    tax_number: "A1234567",
    country: "Kenya",
    county: "Nairobi",
    city: "Nairobi",
    po_box: 1234,
    date_of_birth: new Date("1990-01-01"),
  };
  const customer = FAKE_CUSTOMER;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: customer,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Just log and fake success
    console.log(values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Customer information updated (fakedata)");
      navigate("/customers");
    }, 1000);
  }
  return (
    <div className="container mx-auto py-10">
      <Breadcrumb
        title="Edit Customer"
        description="Modify member information"
        homePath="/"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-5">
              <FormField
                control={form.control}
                name="id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID No.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="345893"
                        {...field}
                        className="!focus-visible:ring-0 !focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <FormField
                control={form.control}
                name="salutation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salutation</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => v != "" && field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salutation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
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
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Middle"
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
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+2547..."
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
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
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax No.</FormLabel>
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
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="w-full text-lg font-medium">Addresses</div>
            <Separator className="my-4 bg-slate-400" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Kenya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="po_box"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P.O. Box</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* KYC SECTION */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="w-full text-lg font-medium">KYC Information</div>
            <Separator className="my-4 bg-slate-400" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="kyc_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KYC Level</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => v !== "" && field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select KYC Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Level 1">Level 1</SelectItem>
                        <SelectItem value="Level 2">Level 2</SelectItem>
                        <SelectItem value="Level 3">Level 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kyc_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KYC Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => v !== "" && field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select KYC Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kyc_expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>KYC Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ID Document Upload */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="w-full text-lg font-medium flex items-center gap-2">
              <UploadCloud className="h-5 w-5" /> Upload ID Document
            </div>
            <Separator className="my-4 bg-slate-400" />
            <Controller
              control={control}
              name="id_document"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>ID Document (PDF/Image)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                  {field.value && (
                    <p className="text-sm mt-1">{(field.value as File).name}</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Supporting Documents Upload */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="w-full text-lg font-medium flex items-center gap-2">
              <UploadCloud className="h-5 w-5" /> Upload Supporting Documents
              (PDF)
            </div>
            <Separator className="my-4 bg-slate-400" />
            <Controller
              control={control}
              name="supporting_documents"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? Array.from(e.target.files) : []
                        )
                      }
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                  {watchSupportingDocs && watchSupportingDocs.length > 0 && (
                    <ul className="text-sm mt-1 list-disc list-inside">
                      {watchSupportingDocs.map((file: File, idx: number) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Guarantors Section */}
          <div className="bg-gray-200/50 my-5 p-5 rounded-md dark:bg-blue-900">
            <div className="w-full text-lg font-medium flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Guarantors
            </div>
            <Separator className="my-4 bg-slate-400" />
            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="mb-5 border rounded p-3 relative"
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    placeholder="Name"
                    {...register(`guarantors.${index}.name` as const)}
                  />
                  <Input
                    placeholder="ID Number"
                    {...register(`guarantors.${index}.id_number` as const)}
                  />
                  <Input
                    placeholder="Phone"
                    {...register(`guarantors.${index}.phone` as const)}
                  />
                  <Input
                    placeholder="Email"
                    {...register(`guarantors.${index}.email` as const)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                append({ name: "", id_number: "", phone: "", email: "" })
              }
            >
              Add Guarantor
            </Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {loading && <Spinner />}
    </div>
  );
};

export default CustomersEdit;
