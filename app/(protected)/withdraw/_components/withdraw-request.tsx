"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { WithdrawMoneySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RequestWithdrawal } from "@/actions/withdraw-request";

type RequestWithdrawalFormProps = {
  userId: string;
};

const RequestWithdrawalForm = ({ userId }: RequestWithdrawalFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof WithdrawMoneySchema>>({
    resolver: zodResolver(WithdrawMoneySchema),
    defaultValues: {
      accountNumber: "",
      ifscCode: "",
      beneficiaryName: "",
      withdrawAmount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof WithdrawMoneySchema>) {
    console.log("onSubmit triggered with values:", values);
    const formData = new FormData();
    formData.append("userId", userId);

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      formData.append(`${field}`, `${values[field]}`);
    }

    startTransition(() => {
      RequestWithdrawal(formData).then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          form.reset();
          router.refresh();
        }
        if (data?.error) {
          toast.error(data?.error);
        }
      });
    });
  }

  return (
    <section className="md:overflow-auto w-full px-2">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log("Form submitted");
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-3 my-2 md:mt-5"
        >
          <div className="space-y-2 px-2 pb-4">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Account Number"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the IFSC Code"
                      autoComplete="off"
                      disabled={isPending}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beneficiaryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiary Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the Beneficiary Name"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="withdrawAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdraw Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Withdraw Amount"
                      autoComplete="off"
                      disabled={isPending}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full mb-0 mt-40"
          >
            Submit Withdrawal Request
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default RequestWithdrawalForm;
