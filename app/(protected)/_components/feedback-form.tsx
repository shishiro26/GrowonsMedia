"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FeedbackSchema, OrderSchema } from "@/schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { addFeedback } from "@/actions/feedback";
import { toast } from "sonner";

type Order = {
  orderId: string;
};

type FeedbackFormProps = {
  orders: Order[];
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ orders }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      orderId: "",
      feedback: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FeedbackSchema>) => {
    setError("");
    startTransition(() => {
      addFeedback(values).then((data) => {
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
    <>
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
                      <SelectTrigger className="w-[100%] md:w-[50%]">
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
                        orders.map((order) => (
                          <SelectItem key={order.orderId} value={order.orderId}>
                            {order.orderId}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem className="w-[100%]">
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your feedback"
                      rows={15}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            className="flex justify-end"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default FeedbackForm;
