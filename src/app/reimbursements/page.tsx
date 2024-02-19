"use client";

import Reimbursement from "@/database/reimbursementSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().min(1).max(50),
  transactionDate: z.date(),
  amount: z.number(),
  purpose: z.string().max(1000),
});

export default function Page() {
  // definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      transactionDate: new Date(),
      amount: 0,
      purpose: "",
    },
  });

  // submisson handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Reset the form fields
    form.reset({
      name: "",
      email: "",
      transactionDate: new Date(), // Reset to current date or you can set a default date
      amount: 0,
      purpose: "",
    });
  }

  // implementation
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Name </FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block mb-2"> Transaction Date </FormLabel>
              <FormControl>
                <DatePicker {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Transaction Amount </FormLabel>
              <FormControl>
                <Input type="number" placeholder="$ amount" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Transaction Purpose </FormLabel>
              <FormControl>
                <Input placeholder="purpose" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
