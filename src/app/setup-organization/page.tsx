"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(1000),
  website: z.string().url(),
  email: z.string().email(),
});

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      email: "",
    },
  });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return router.push("/sign-in");
  }
  if (user?.unsafeMetadata?.organization || user?.publicMetadata?.admin) {
    return router.push("/");
  }
  const onSubmit = async (data: any) => {
    user.update({
      unsafeMetadata: {
        organization: { ...data, approved: false },
      },
    });
    router.push("/");
  };

  return (
    <div>
      <h1>Setup Organization</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="website" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your organization website link.
                </FormDescription>
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
                  <Input placeholder="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const emailBody = `Hi there,

I would like to set up an organization with the following details:

Name: ${form.getValues("name")}
Description: ${form.getValues("description")}
Website: ${form.getValues("website")}

Attached is my W9 form.

Thank you!`;

              const emailLink = `mailto:${form.getValues(
                "email",
              )}?subject=Organization%20Setup&body=${encodeURIComponent(
                emailBody,
              )}`;

              window.location.href = emailLink;
            }}
          >
            Send Email
          </Button>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
