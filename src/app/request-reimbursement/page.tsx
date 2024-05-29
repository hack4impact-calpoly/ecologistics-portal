"use client";

import CenteredSpinner from "@/components/centered-spinner";
import FullscreenSpinner from "@/components/fullscreen-spinner";
import ImageUpload from "@/components/image-upload";
import { W9Verification } from "@/components/sponsored-org/w9-verification";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  amount: z.union([z.number(), z.string().transform((value) => parseFloat(value))]),
  paymentMethod: z.string().min(1).max(100),
  purpose: z.string().max(1000),
  file: z.any(),
  comment: z.string(),
});

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

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
      comment: "",
    },
  });

  // submisson handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitDisabled(true);
    setLoading(true);
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
        setSubmitDisabled(false);
        setLoading(false);
        throw new Error("Failed to submit reimbursement");
      })
      .then(() => {
        // Reset the form fields
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
        setSubmitDisabled(false);
        setLoading(false);
        console.error(error);
      });
  }

  if (!isLoaded || loading) {
    return <FullscreenSpinner />;
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
    const { recipientName, recipientEmail, transactionDate, amount, purpose } = form.getValues();
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
    <main className="flex flex-col items-center p-10 w-full">
      <Card className="w-1/2 min-w-96 max-w-2xl">
        <CardHeader>
          <CardTitle>Request Reimbursement</CardTitle>
          <CardDescription>Submit a reimbursement request to Ecologistics.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form id="request-reimbursement-form" onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Recipient Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Recipient name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Recipient Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Receipient email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2">
                      Transaction Date <span className="text-red-500">*</span>
                    </FormLabel>
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
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                    <FormLabel>
                      Transaction Amount <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Amount ($)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Transaction Purpose <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Purpose" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Method <span className="text-red-500">*</span>
                    </FormLabel>
                    <br />
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-64">
                            {field.value || "Select payment method"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => field.onChange("ACH")}>ACH</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => field.onChange("Check")}>Check</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => field.onChange("PayPal")}>PayPal</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => field.onChange("Venmo")}>Venmo</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => field.onChange("Zelle")}>Zelle</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    {field.value && (
                      <FormMessage className="text-sm text-muted-foreground">
                        Please submit your account information in the comment field. If the information is sensitive,
                        please send it via email instead.
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Comment </FormLabel>
                    <FormControl>
                      <Input placeholder="Comment (optional)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file" // where did this come from?
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Receipt Upload <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUpload handleChange={field.onChange}></ImageUpload>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 mt-4">
              <Button variant="secondary" type="button" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Dialog>
                <DialogTrigger>
                  <Button className="bg-orange-500 hover:bg-orange-600" type="button" disabled={submitDisabled}>
                    Submit
                  </Button>
                </DialogTrigger>
                <W9Verification submitDisabled={submitDisabled} constructEmail={constructEmail} />
              </Dialog>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
