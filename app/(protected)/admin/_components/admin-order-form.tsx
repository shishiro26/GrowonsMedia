"use client";
import { acceptInvoice, rejectInvoice } from "@/actions/admin-invoice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { AcceptOrderSchema, RejectInvoiceSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type InvoiceProps = {
  id: string;
};

const AdminOrderForm = ({ id }: InvoiceProps) => {
  const [isPending, startTransition] = useTransition();

  const rejectForm = useForm<z.infer<typeof RejectInvoiceSchema>>({
    resolver: zodResolver(RejectInvoiceSchema),
    defaultValues: {
      id: id,
      reason: "",
    },
  });

  const acceptForm = useForm<z.infer<typeof AcceptOrderSchema>>({
    resolver: zodResolver(AcceptOrderSchema),
    defaultValues: {
      id: id,
      file: undefined,
    },
  });

  const handleAccept = async () => {
    startTransition(() => {
      acceptInvoice(id).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
        if (data?.error) {
          toast.error(data.error, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
      });
    });
  };

  const handleReject = async (values: z.infer<typeof RejectInvoiceSchema>) => {
    startTransition(() => {
      rejectInvoice({ id: id, reason: values.reason }).then((data) => {
        if (data?.success) {
          toast.success(data.success, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
        }
        if (data?.error) {
          toast.error(data.error, {
            action: {
              label: "close",
              onClick: () => console.log("Undo"),
            },
          });
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
            <DialogTitle>Accept the order :</DialogTitle>
          </DialogHeader>
          <Form {...acceptForm}>
            <form onSubmit={acceptForm.handleSubmit(handleAccept)}>
              <div>
                <FormField
                  control={acceptForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attach the file below:</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          disabled={isPending}
                          placeholder="Attach the screenshot here"
                          type="file"
                          {...acceptForm.register("file")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            <DialogTitle>Are you absolutely sure??</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)}>
              <div className="py-2">
                <FormField
                  control={rejectForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Reason for rejection"
                          autoComplete="off"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Submit</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderForm;
