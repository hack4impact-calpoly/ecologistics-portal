"use client";

import CenteredSpinner from "@/components/centered-spinner";
import ImageUpload from "@/components/image-upload";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const constructEmail = () => {
    const { recipientName, recipientEmail, transactionDate, amount, purpose } =
      form.getValues();
    const emailBody = `Hi there,

I would like to submit the following transaction details:

Name: ${recipientName}
Email: ${recipientEmail}
Transaction Date: ${format(transactionDate, "PPP")}
Amount: ${amount}
Purpose: ${purpose}

Thank you!`;

    const emailLink = `mailto:stacey@ecologistics.org?subject=Transaction%20Details&body=${encodeURIComponent(
      emailBody,
    )}`;

    window.location.href = emailLink;
  };

  return (
    <div className="flex w-full justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg flex flex-col min-h-screen">
        <header className="mb-4">
          <a href="#" className="text-orange-600 text-sm inline-block mb-2">
            Go Back
          </a>
          <h1 className="text-2xl font-semibold">Request a Reimbursement</h1>
        </header>
        <div className="flex flex-grow">
          <div className="w-1/3 p-4 bg-[#EDEBDA] rounded-lg text-center flex flex-col items-center justify-center">
            <label
              htmlFor="receipt-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Step 1: Please upload a receipt for this expense
            </label>
            <ImageUpload
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  form.setValue("file", e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="w-2/3 pl-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">
                          Recipient Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Recipient Name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">
                          Recipient Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Recipient Email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="transactionDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="form-label">
                            Transaction Date
                          </FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
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
                        <FormItem className="flex-1">
                          <FormLabel className="form-label">Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Amount"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="form-label">Purpose</FormLabel>
                        <FormControl>
                          <Input placeholder="Purpose" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="bg-gray-100 mt-6 p-4 rounded-lg text-center">
          <h4 className="text-xl font-semibold">
            Did you email your W9 form to Stacey?
          </h4>
          <p className="mb-4">Click yes or no</p>
          <div className="flex justify-around">
            <Button
              onClick={handleConfirm}
              className="bg-green-300 text-green-800 hover:bg-green-400 px-6 py-2 rounded-md"
            >
              Yes
            </Button>
            <Button
              onClick={handleDeny}
              className="bg-red-300 text-red-800 hover:bg-red-400 px-6 py-2 rounded-md"
            >
              No
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={constructEmail}
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Generate Email Template
          </Button>
        </div>
      </div>
    </div>
  );
}
