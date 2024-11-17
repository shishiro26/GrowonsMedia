"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { acceptWithdrawal, rejectWithdrawal } from "@/actions/admin-withdraw";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptWithdrawalSchema, RejectWithdrawalSchema } from "@/schemas";

type FormWithdrawalProps = {
  requestId: string;
  userId: string;
};


const FormWithdrawal = ({ requestId, userId }: FormWithdrawalProps) => {
  const [isPending, startTransition] = useTransition();

  const acceptForm = useForm<z.infer<typeof AcceptWithdrawalSchema>>({
    resolver: zodResolver(AcceptWithdrawalSchema),
    defaultValues: {
      transactionId: "",
      image: undefined,
    },
  });

  const rejectForm = useForm<z.infer<typeof RejectWithdrawalSchema>>({
    resolver: zodResolver(RejectWithdrawalSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleAccept = async (
    values: z.infer<typeof AcceptWithdrawalSchema>
  ) => {
    const formData = new FormData();
    formData.append("requestId", requestId);
    formData.append("userId", userId);
    formData.append("transactionId", values.transactionId);
    

    for (const field of Object.keys(values) as Array<keyof typeof values>) {
      if (field === "image") {
        formData.append("image", values[field]);
      } else {
        formData.append(`${field}`, `${values[field]}`);
      }
    }

    startTransition(() => {
      acceptWithdrawal(formData).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          acceptForm.reset();
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };

  const handleReject = async (
    values: z.infer<typeof RejectWithdrawalSchema>
  ) => {
    startTransition(() => {
      rejectWithdrawal({
        id : requestId,
        reason: values.reason,
      }).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          rejectForm.reset();
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <div className="space-x-2 flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={isPending}>Accept</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept the withdrawal request</DialogTitle>
          </DialogHeader>
          <Form {...acceptForm}>
            <form
              onSubmit={acceptForm.handleSubmit(handleAccept)}
              className="space-y-4"
            >
              <FormField
                control={acceptForm.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Transaction ID"
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
              control={acceptForm.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach the screenshot below:</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={isPending}
                      placeholder="Attach the screenshot here"
                      type="file"
                      {...acceptForm.register("image")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !acceptForm.watch("transactionId") ||
                    !acceptForm.watch("image")
                  }
                >
                  Confirm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Reject</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject the withdrawal request</DialogTitle>
          </DialogHeader>
          <Form {...rejectForm}>
            <form
              onSubmit={rejectForm.handleSubmit(handleReject)}
              className="space-y-4"
            >
              <FormField
                control={rejectForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Rejection</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the reason for rejection"
                        autoComplete="off"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormWithdrawal;
