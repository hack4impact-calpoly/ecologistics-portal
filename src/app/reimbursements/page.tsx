"use client";

// import Reimbursement from "@/database/reimbursementSchema";
import ImageUpload from "@/components/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

import CenteredSpinner from "@/components/centered-spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  recipientName: z.string().min(1).max(50),
  recipientEmail: z.string().min(1).max(50),
  transactionDate: z.date(),
  amount: z.union([
    z.number(),
    z.string().transform((value) => parseFloat(value)),
  ]),
  paymentMethod: z.string().min(1).max(100),
  purpose: z.string().max(1000),
  file: z.any(),
});

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      transactionDate: new Date(),
      amount: 0,
      paymentMethod: "",
      purpose: "",
      file: undefined,
    },
  });

  // submisson handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConfirmed) return;
    // initialize multipart form data
    const formData = new FormData();
    // append all form values to form data
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // set organization field to the user's id
    formData.append("clerkUserId", user?.id as string);
    fetch("api/reimbursement", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to submit reimbursement");
      })
      .then(() => {
        // Reset the form fields
        setIsConfirmed(false);
        form.reset({
          recipientName: "",
          recipientEmail: "",
          transactionDate: new Date(), // Reset to current date or you can set a default date
          amount: 0,
          paymentMethod: "",
          purpose: "",
          file: undefined,
        });
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleConfirm() {
    setIsConfirmed(true);
  }

  function handleDeny() {
    setIsConfirmed(false);
  }

  if (!isLoaded) {
    return (
      <div>
        <CenteredSpinner />
      </div>
    );
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (
    !(
      user?.unsafeMetadata?.organization as {
        name: string;
        description: string;
        website: string;
        approved: boolean;
      }
    )?.approved
  ) {
    return router.push("/");
  }
  // implementation
  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-5">
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Recipient Name </FormLabel>
                <FormControl>
                  <Input placeholder="recipientName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Recipient Email </FormLabel>
                <FormControl>
                  <Input placeholder="recipientEmail" {...field} />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
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
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Payment Method </FormLabel>
                <FormControl>
                  <Input placeholder="payment method" {...field} />
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
          <FormField
            control={form.control}
            name="file" // where did this come from?
            render={({ field }) => (
              <FormItem>
                <FormLabel> File Upload </FormLabel>
                <FormControl>
                  <ImageUpload handleChange={field.onChange}></ImageUpload>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex flex-col bg-gray-200 items-center space-y-2">
        <h4 className="p-3 pb-0 text-2xl font-bold ">
          Did you email your W9 form to Stacey?
        </h4>
        <p className="text-lg pb-2">Click yes or no</p>
        <div className="w-[90%] flex justify-between pb-4">
          <Button
            onClick={handleConfirm}
            className="w-[30%] bg-green-300 bg-opacity-80 text-green-800 hover:bg-green-300"
          >
            Yes
          </Button>
          <Button
            onClick={handleDeny}
            className="w-[30%] bg-red-400 bg-opacity-80 text-red-800 hover:bg-red-400"
          >
            No
          </Button>
        </div>
      </div>
    </main>
  );
}
