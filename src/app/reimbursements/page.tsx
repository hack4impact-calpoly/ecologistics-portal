"use client";

// import Reimbursement from "@/database/reimbursementSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ImageUpload from "@/components/image-upload";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/centered-spinner";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().min(1).max(50),
  transactionDate: z.date(),
  amount: z.union([
    z.number(),
    z.string().transform((value) => parseFloat(value)),
  ]),
  purpose: z.string().max(1000),
  file: z.any(), // i orginalkly wanted to set to z.instanceOf(Blob), // adding a file (file extends Blob)
});

export default function Page() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();
  // definition
  const [file, setFile] = useState<File>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      transactionDate: new Date(),
      amount: 0,
      purpose: "",
      file: undefined,
    },
  });

  // submisson handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConfirmed) return;
    console.log(values);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetch("api/reimbursement", {
      method: "POST",
      body: formData,
    })
      .then((response: Response) => {
        response.json();
      })
      .then((data) => console.log(data));

    // Reset the form fields
    setIsConfirmed(false);
    form.reset({
      name: "",
      email: "",
      transactionDate: new Date(), // Reset to current date or you can set a default date
      amount: 0,
      purpose: "",
      file: setFile(undefined),
    });
  }

  function handleConfirm() {
    setIsConfirmed(true);
  }

  function handleDeny() {
    setIsConfirmed(false);
  }

  const { isLoaded, isSignedIn, user } = useUser();
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
