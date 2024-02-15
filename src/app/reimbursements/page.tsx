"use client";

import Reimbursement from "@/database/reimbursementSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
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
  }

  // implementation
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormLabel> Transaction Date </FormLabel>
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
      </form>
    </Form>
  );
}
