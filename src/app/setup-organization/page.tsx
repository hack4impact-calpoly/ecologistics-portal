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
import CenteredSpinner from "@/components/centered-spinner";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(1000),
  website: z.string().url(),
});

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
    },
  });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return (
      <div className="w-screen h-screen">
        <CenteredSpinner />
      </div>
    );
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
      <Form data-testid="cypress-setup-form" {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="cypress-setup-name">
                  Organization Name
                </FormLabel>
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
                <FormLabel data-testid="cypress-setup-description">
                  Organization Description
                </FormLabel>
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
                <FormLabel data-testid="cypress-setup-website">
                  Website
                </FormLabel>
                <FormControl>
                  <Input placeholder="website" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your organization website link.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
