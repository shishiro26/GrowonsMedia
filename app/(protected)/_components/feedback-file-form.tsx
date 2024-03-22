"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addFeedbackFile } from "@/actions/feedback";
import { toast } from "sonner";
import {
  Sheet,
  SheetTitle,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { FeedbackFileSchema } from "@/schemas";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type User = {
  name: string;
} | null;

type Order = {
  orderId: string;
  user: User;
  createdAt: Date;
};

type FeedbackFormProps = {
  userId: string;
  orders: Order[];
};
const FeedbackFileForm: React.FC<FeedbackFormProps> = ({ orders, userId }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FeedbackFileSchema>>({
    resolver: zodResolver(FeedbackFileSchema),

    defaultValues: {
      userId: userId,
      orderId: "",
      file: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof FeedbackFileSchema>) => {
    setError("");
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("orderId", values.orderId);
    formData.append("fileName", values.file.name);

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "file") {
        formData.append("file", values[field]);
      }
    }

    startTransition(() => {
      addFeedbackFile(formData).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
          form.reset();
        }

        if (data.error) {
          setError(data?.error);
        }
      });
    });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"}>Upload file</Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:w-full">
        <SheetTitle>
          <p className="text-2xl font-bold">Add Feedback</p>
        </SheetTitle>
        <Separator className="border border-gray-500" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[100%]">
                          {orders.length === 0 ? (
                            <SelectValue placeholder="No orders found" />
                          ) : (
                            <SelectValue placeholder="Select a order Id" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {orders.length !== 0 &&
                          orders.map((order) => {
                            return (
                              <SelectItem
                                key={order.orderId}
                                value={order.orderId}
                              >
                                {order.user?.name} -{" "}
                                {order.createdAt.toDateString()} -{" "}
                                {order.orderId}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attach the file below:</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={isPending}
                        placeholder="Attach the file here"
                        type="file"
                        {...form.register("file")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            {form.formState.errors && (
              <Button type="submit" className="w-full" disabled={isPending}>
                Submit Feedback
              </Button>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackFileForm;
