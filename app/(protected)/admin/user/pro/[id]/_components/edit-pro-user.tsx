"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editProUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { editProUser } from "@/actions/user-pro";
import { toast } from "sonner";

interface Product {
  name: string;
  minProduct: number;
  maxProduct: number;
  price: number;
}

interface Subscription {
  id: string;
  amount_limit: number;
  amount: number;
  products: Product[];
  proRecharge: boolean;
  isRecharged: boolean;
  userId: string;
}

type ProUserProps = {
  user: Subscription | null;
};

const EditProUserForm = ({ user }: ProUserProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof editProUserSchema>>({
    resolver: zodResolver(editProUserSchema),
    defaultValues: {
      userId: user?.id,
      amount: user?.amount_limit,
      products: user?.products || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "products",
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof editProUserSchema>) => {
    setError("");
    startTransition(() => {
      editProUser(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          toast.error(data.error);
        }

        if (data?.success) {
          toast.success(data.success);
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      });
    });
  };

  return (
    <section className="m-2 p-2">
      <h1 className="text-3xl my-3">Update pro user </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Enter the amount limit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter the amount limit"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:h-[50vh] overflow-y-auto space-y-2">
              {fields.map((product, index) => (
                <div key={product.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter product name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.minProduct`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Minimum Product</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter minimum product"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.maxProduct`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Maximum Product</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter maximum product"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Enter price"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => remove(index)}
                    className="w-full md:w-[50%]"
                    disabled={isPending}
                  >
                    Remove Product
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant={"secondary"}
                onClick={() =>
                  append({
                    name: "",
                    minProduct: 0,
                    maxProduct: 1,
                    price: 0,
                  })
                }
                disabled={isPending}
                className="w-full md:w-[50%]"
              >
                Add Product
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full md:w-[50%]"
            disabled={isPending}
          >
            Update
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EditProUserForm;
