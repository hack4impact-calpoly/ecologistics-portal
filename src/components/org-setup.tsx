import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function OrgSetup() {
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // form submission logic here
    console.log("Form data submitted:", data);
  };

  return (
    <div>
      <h1>Organization Setup</h1>
      <Form>
        <FormItem>
          <FormLabel>Organzation Name</FormLabel>
          <FormControl>
            <FormField
              control={control}
              name="name"
              render={({ field }) => <input {...field} />}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Organzation Description</FormLabel>
          <FormControl>
            <FormField
              control={control}
              name="description"
              render={({ field }) => <textarea {...field} />}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Website</FormLabel>
          <FormControl>
            <FormField
              control={control}
              name="website"
              render={({ field }) => <input {...field} />}
            />
          </FormControl>
          <FormDescription>
            Enter your organization website link.
          </FormDescription>
          <FormMessage>Organization First-Time Information</FormMessage>
        </FormItem>

        <FormItem>
          <FormControl>
            <button type="submit">Submit</button>
          </FormControl>
        </FormItem>
      </Form>
    </div>
  );
}
