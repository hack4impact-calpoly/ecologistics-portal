"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/centered-spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      website: "https://",
    },
  });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <CenteredSpinner />;
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

  const autofillUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (!url.startsWith("http")) {
      form.setValue("website", `https://${url}`);
      return;
    }
    form.setValue("website", url);
  };

  return (
    <main className="flex flex-col items-center p-10 w-full">
      <Card className="w-1/2 min-w-96 max-w-2xl">
        <CardHeader>
          <CardTitle>Setup Organization</CardTitle>
          <CardDescription>Setup your organization with Ecologistics.</CardDescription>
        </CardHeader>
        <Form data-testid="cypress-setup-form" {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="cypress-setup-name">
                      Organization Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Full Organization Name" {...field} />
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
                      Organization Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Organization Description" {...field} />
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
                      Website <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="URL" {...field} onChange={autofillUrl} />
                    </FormControl>
                    <FormDescription>Enter your organization website link.</FormDescription>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 mt-4">
              <Button className="bg-orange-500 hover:bg-orange-600" type="submit">
                Submit
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
